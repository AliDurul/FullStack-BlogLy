'use client'
import Link from 'next/link';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect, useRef } from 'react';
import sortBy from 'lodash/sortBy';
import { selectIsDarkMode } from '@/lib/features/themeConfig/themeConfigSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { downloadExcel } from 'react-export-table-to-excel';
import { DeleteIcon, EditIcon, PreviewIcon, PrintIcon } from '@/app/icons';
import useDeleteToasts from '@/hooks/useDeleteToasts';
import { fetchAllInvoicesAsync, selectInvoiceStates, updateInvoiceState, updateInvoices } from '@/lib/features/invoices/invoiceSlice';
import { deleteInvoice, deleteMultiInvoice } from '@/lib/features/invoices/invoiceAPI';
import { coloredToast } from '@/utils/sweetAlerts';
import { formatDate } from '@/utils/helperFunctions';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Search from './Search';


const InvoiceTable = ({ IMG_URL }: { IMG_URL: string }) => {
    const { error, status, invoices } = useAppSelector(selectInvoiceStates);
    const { deleteToast, multiDeleteToast } = useDeleteToasts();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const isDark = useAppSelector(selectIsDarkMode)
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();


    // queru params for pagination & search
    const page = (searchParams.get('page') || 1) as string;
    const pageSize = (searchParams.get('pageSize') || 10) as string;
    const search = (searchParams.get('search') || '') as string;


    useEffect(() => {
        dispatch(fetchAllInvoicesAsync({ page, pageSize, search }));
    }, []);

    useEffect(() => {
        if (error) coloredToast('danger', error);
    }, [error]);

    const col = ['id', 'staff.first_name', 'customer.first_name', 'amount_due', 'payment_terms', 'date_joined', 'total_price', 'status'];
    const header = ['Id', 'Staff Name', 'Customer Name', 'Due Date', 'Payment Terms', 'Data Joined', 'Total Price', 'Status'];

    // const [page, setPage] = useState(1);
    // const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    // const [search, setSearch] = useState('');
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [initialRecords, setInitialRecords] = useState(sortBy(invoices?.results, 'id'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });


    useEffect(() => {
        setRecords(invoices?.results);
        setInitialRecords(invoices?.results);
    }, [invoices?.results]);

    // useEffect(() => {
    //     setPage(1);
    // }, [pageSize]);

    useEffect(() => {
        // const from = (page - 1) * pageSize;
        // const to = from + pageSize;
        // setRecords([...(Array.isArray(initialRecords) ? initialRecords.slice(from, to) : [])]);

        router.push(`?${new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString(), search: search.toString() })}`, { scroll: false });
        dispatch(fetchAllInvoicesAsync({ page, pageSize, search }));
    }, [page, pageSize, search]);

    useEffect(() => {
        setInitialRecords(() => {
            return invoices?.results?.filter((item: any) => {
                return (
                    item?.staff?.first_name.toLowerCase().includes(search.toLowerCase()) ||
                    item?.customer?.first_name.toLowerCase().includes(search.toLowerCase()) ||
                    item?.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
                    item?.status?.toLowerCase().includes(search.toLowerCase()) ||
                    item?.payment_terms?.toLowerCase().includes(search.toLowerCase())
                    // item?.total_price?.toString().toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);


    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        // setPage(1);
    }, [sortStatus]);

    const deleteRow = async (id: any = null) => {

        const params = new URLSearchParams();

        if (id) {
            const deletionSuccess = await deleteToast(id, deleteInvoice, updateInvoices);

            if (deletionSuccess) {
                setSelectedRecords([]);
                // setSearch("");
                // setPage(1);

                params.append("page", "1");
                params.append("pageSize", "10");
                params.append("search", "");
                router.push(`?${params.toString()}`, { scroll: false });
            }
        } else {
            let selectedRows = selectedRecords || [];
            if (selectedRows?.length === 0) {
                coloredToast("warning", "Select items to delete!");
                return;
            }
            const ids = selectedRows?.map((d: any) => { return d.id; });
            const deletionSuccess = await multiDeleteToast(ids, deleteMultiInvoice, updateInvoices);

            if (deletionSuccess) {
                setSelectedRecords([]);
                // setSearch("");
                // setPage(1);
                params.append("page", "1");
                params.append("pageSize", "10");
                params.append("search", "");
                router.push(`?${params.toString()}`, { scroll: false });
            }
        }

    };

    // Print functions:
    /* function handleDownloadExcel() {
        downloadExcel({
            fileName: 'table',
            sheet: 'react-export-table-to-excel',
            tablePayload: {
                header,
                // @ts-ignore
                body: items,
            },
        });
    }

    const capitalize = (text: any) => {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };

    const exportTable = (type: any) => {
        let columns: any = col;
        let records = invoices;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: any) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type === 'print') {
            var rowhtml = '<p>' + filename + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            columns.map((d: any) => {
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';
            records.map((item: any) => {
                rowhtml += '<tr>';
                columns.map((d: any) => {
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>Print</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
        } else if (type === 'txt') {
            let coldelimiter = ',';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: any) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
                var data1 = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
                var link1 = document.createElement('a');
                link1.setAttribute('href', data1);
                link1.setAttribute('download', filename + '.txt');
                link1.click();
            } else {
                var blob1 = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob1, filename + '.txt');
                }
            }
        }
    }; */

    const handleSearchQuery = async (e: React.FormEvent) => {
        e.preventDefault();

        const searchValue = searchInputRef.current?.value || '';

        const params = new URLSearchParams();
        params.append("page", page);
        params.append("pageSize", pageSize);
        params.append('search', searchValue);
        dispatch(fetchAllInvoicesAsync({ page, pageSize, search }));

    }

    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b] mt-7">
            <div className="invoice-table">
                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex flex-wrap items-center gap-2">
                        {
                            selectedRecords.length >= 1 && <button type="button" className="btn btn-danger  gap-2" onClick={() => deleteRow()}>
                                <DeleteIcon />
                                Delete
                            </button>
                        }
                        <button onClick={() => { router.push(`/invoice/action`), dispatch(updateInvoiceState(null)) }} className="btn btn-primary btn-sm  gap-2">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add New
                        </button>
                    </div>

                    <Search search={search} />

                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className={`${isDark} table-hover whitespace-nowrap`}
                        records={records?.map((invoice, index) => ({
                            ...invoice,
                            serialNumber: index + 1,
                        }))}
                        columns={[
                            {
                                accessor: 'id',
                                sortable: true,
                                render: ({ serialNumber }) => (
                                    <Link href="/apps/invoice/preview">
                                        <div className="font-semibold text-primary underline hover:no-underline">{`#${serialNumber}`}</div>
                                    </Link>
                                ),
                            },
                            {
                                accessor: 'Staf Name',
                                sortable: true,
                                render: ({ staff, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div className="w-max rounded-full bg-white-dark/20 p-1 ltr:mr-2 rtl:ml-2 ">
                                            <Image
                                                width={32}
                                                height={32}
                                                className="rounded-full object-cover"
                                                src={`${staff.profile_pic ? IMG_URL + staff?.profile_pic : '/assets/images/profile-pic.png'}`}
                                                alt="staff pic" />
                                        </div>
                                        <div>{staff?.first_name} {staff?.last_name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Customer Name',
                                sortable: true,
                                render: ({ customer, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div className="w-max rounded-full bg-white-dark/30 p-1 ltr:mr-2 rtl:ml-2">
                                            <Image
                                                width={32}
                                                height={32}
                                                className="h-8 w-8 rounded-full object-cover"
                                                src={customer.profile_pic ? IMG_URL + customer.profile_pic : '/assets/images/profile-pic.png'} alt="customer pic" />

                                        </div>
                                        <div>{customer?.first_name} {customer?.last_name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Due Date',
                                sortable: true,
                                render: ({ amount_due }) => <span >{amount_due}</span>
                            },
                            {
                                accessor: 'payment_terms',
                                sortable: true
                            },
                            {
                                accessor: 'Create Date',
                                // sortable: true,
                                render: ({ timestamp }) => <span >{formatDate(timestamp)}</span>
                            },
                            {
                                accessor: 'Total Price',
                                sortable: true,
                                titleClassName: 'text-right',
                                render: ({ total_price, id }) => <div className=" font-semibold">{`$${total_price}`}</div>,
                            },
                            {
                                accessor: 'status',
                                sortable: true,
                                render: ({ status }) => <span className={`badge 
                                badge-outline-${status === 'Draft' ? 'primary'
                                        : status === 'Sent' ? 'secondary'
                                            : status === 'Paid' ? 'success'
                                                : status === 'Overdue' ? 'danger'
                                                    : status === 'Closed' ? 'danger'
                                                        : status === 'Refunded' ? 'danger' : ''}`}>{status}</span>,
                            },
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: (invoice) => (
                                    <div className="mx-auto flex w-max items-center gap-4">
                                        <button
                                            onClick={() => { router.push(`/invoice/action`), dispatch(updateInvoiceState(invoice)) }}
                                            className="flex hover:text-info">
                                            <EditIcon />
                                        </button>
                                        <Link href={`/invoice/${invoice?.id}`} className="flex hover:text-primary">
                                            <PreviewIcon />
                                        </Link>
                                        <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(invoice?.id)}>
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={invoices?.count}
                        recordsPerPage={Number(pageSize)}
                        page={Number(page)}
                        onPageChange={(p) => router.push(`?${new URLSearchParams({ page: p.toString(), pageSize: pageSize.toString() })}`, { scroll: false })}
                        onRecordsPerPageChange={(ps) => router.push(`?${new URLSearchParams({ page: page.toString(), pageSize: ps.toString() })}`, { scroll: false })}
                        recordsPerPageOptions={PAGE_SIZES}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div >
    );
};



export default InvoiceTable;
