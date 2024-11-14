'use client'
import Link from 'next/link';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { selectIsDarkMode } from '@/lib/features/themeConfig/themeConfigSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/app/icons';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import TicketModal from './TicketModal';
import { fetchAllTicketAsync, selectTicketState, selectTickets, setTicketModal, updateTicketState, updateTickets } from '@/lib/features/tickets/ticketSlice';
import { formatDate, truncateText } from '@/utils/helperFunctions';
import useDeleteToasts from '@/hooks/useDeleteToasts';
import { deleteMultiTicket, deleteTicket } from '@/lib/features/tickets/ticketAPI';
import { coloredToast } from '@/utils/sweetAlerts';
import { fetchAllCategoryAsync } from '@/lib/features/category/categorySlice';
import Dropdown from '@/app/components/Layout/Dropdown';
import { Ticket } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

// const IMG_URL = process.env.NEXT_PUBLIC_IMG_APIBASE_URL

const TicketTable = ({ IMG_URL }: { IMG_URL: string }) => {
    const { deleteToast, multiDeleteToast } = useDeleteToasts();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    // search params for pagination
    const page = (searchParams.get('page') || 1) as string;
    const pageSize = (searchParams.get('pageSize') || 10) as string;

    const tickets = useAppSelector(selectTickets);
    const ticketStates = useAppSelector(selectTicketState);
    const isDark = useAppSelector(selectIsDarkMode);

    useEffect(() => {
        dispatch(fetchAllTicketAsync({}));
    }, []);

    // const [page, setPage] = useState(1);
    // const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [initialRecords, setInitialRecords] = useState<Ticket[]>(sortBy(tickets.results, 'id'));
    const [records, setRecords] = useState<Ticket[]>(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [date3, setDate3] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState<any>(false);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<string[]>([])
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const defaultParams = {
        escalation: null,
        title: "",
        description: "",
        client_phonenumber: null,
        caller_phonenumber: null,
        caller_email: null,
        email_id: null,
        flag: "",
        cat: 0,
        priority: "Medium",
        status: "Active",
        assigned_agent: { id: "", first_name: "", last_name: "" }
    }

    const statuses = ['Pending', 'Active', 'Resolved', 'Cancelled', 'Escalated'];

    useEffect(() => {
        setRecords(tickets.results);
        setInitialRecords(tickets.results);
    }, [tickets]);

    // useEffect(() => {
    //     setPage(1);
    // }, [pageSize]);

    useEffect(() => {
        // const from = (page - 1) * pageSize;
        // const to = from + pageSize;
        // setRecords([...(Array.isArray(initialRecords) ? initialRecords.slice(from, to) : [])]);


        router.push(`?${new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() })}`, { scroll: false });
        dispatch(fetchAllTicketAsync({ page, pageSize }));

    }, [page, pageSize]);


    useEffect(() => {
        const [startDate, endDate] = date3 ? date3.map((date: string | number | Date) => new Date(date)) : [null, null];
        setInitialRecords(() => {
            return tickets.results.filter((ticket) => {
                const ticketDate = new Date(ticket.timestamp);
                const isInDateRange = startDate && endDate ? (ticketDate >= startDate && ticketDate <= endDate) : true;
                const statusFilter = filters.length > 0 ? filters.includes(ticket.status) : true;
                const matchesSearch = (
                    ticket?.ticket_id?.toLowerCase().includes(search.toLowerCase()) ||
                    ticket?.title?.toLowerCase().includes(search.toLowerCase()) ||
                    ticket?.description?.toLowerCase().includes(search.toLowerCase()) ||
                    ticket?.timestamp?.toLowerCase().includes(search.toLowerCase()) ||
                    (ticket?.assigned_agent?.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
                    (typeof ticket.cat === 'object' && ticket.cat.title.toLowerCase().includes(search.toLowerCase())) ||
                    ticket?.priority?.toLowerCase().includes(search.toLowerCase()) ||
                    ticket?.status?.toLowerCase().includes(search.toLowerCase()) ||
                    ticket?.flag?.toLowerCase().includes(search.toLowerCase()) ||
                    (typeof ticket?.client_phonenumber !== 'number' && ticket?.client_phonenumber?.phone_number?.toLowerCase().includes(search.toLowerCase()))
                );
                return isInDateRange && matchesSearch && statusFilter;

            });
        });
    }, [search, activeFilter, filters]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        // setPage(1);
        // router.push(`?${new URLSearchParams({ page: '1', pageSize: pageSize.toString() })}`, { scroll: false });
    }, [sortStatus]);

    const deleteRow = async (id: any = null) => {
        if (id) {
            const deletionSuccess = await deleteToast(id, deleteTicket, updateTickets);
            if (deletionSuccess) {
                setSelectedRecords([]);
                setSearch("");
            }
        } else {
            let selectedRows = selectedRecords || [];
            if (selectedRows?.length === 0) {
                coloredToast("warning", "Select items to delete!");
                return;
            }
            const ids = selectedRows?.map((d: any) => { return d.id; });
            const deletionSuccess = await multiDeleteToast(ids, deleteMultiTicket, updateTickets);
            if (deletionSuccess) {
                setSelectedRecords([]);
                setSearch("");
                // setPage(1);
                router.push(`?${new URLSearchParams({ page: '1', pageSize: pageSize.toString() })}`, { scroll: false });
            }
        }

    };

    if (ticketStates.status === 'failed') coloredToast('danger', ticketStates.error || 'Failed to fetch tickets');


    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex flex-wrap items-center justify-around gap-2 pl-3">
                        {selectedRecords.length >= 1 && <button type="button" className="btn btn-danger gap-2" onClick={() => deleteRow()}>
                            <DeleteIcon />
                            Delete
                        </button>}
                        <button className="btn btn-sm btn-primary gap-2"
                            onClick={() => {
                                dispatch(setTicketModal(true)),
                                    dispatch(updateTicketState(defaultParams)),
                                    dispatch(fetchAllCategoryAsync({}))
                            }}>
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            New Ticket
                        </button>
                        <div className="dropdown">
                            <Dropdown
                                placement='bottom-start'
                                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary"
                                button={
                                    <button className="btn btn-sm btn-primary gap-3">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 7L2 7" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" />
                                            <path d="M19 12L5 12" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" />
                                            <path d="M16 17H8" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" />
                                        </svg>

                                        Filter
                                    </button>

                                }
                            >
                                <ul className="">
                                    {
                                        statuses.map(status => (
                                            <li key={status}>
                                                <button type="button" onClick={() => setFilters((prev) => {
                                                    if (prev.includes(status)) {
                                                        return prev
                                                    }
                                                    return [...prev, status]
                                                })}>
                                                    {status}
                                                </button>
                                            </li>
                                        ))

                                    }
                                </ul>
                            </Dropdown>
                        </div>
                        {
                            filters.map((filter, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="flex  items-center justify-center">
                                        <span className="flex gap-1 badge text-black bg-[#F7F7F7]  w-full rounded-full">
                                            {filter}
                                            <svg
                                                className='cursor-pointer hover:text-danger'
                                                onClick={() => setFilters((prev) => prev.filter((f) => f !== filter))}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </span>

                                    </div>
                                </div>
                            ))
                        }

                        <TicketModal />
                    </div>
                    <div className='flex justify-center items-center gap-4'>
                        <Flatpickr
                            options={{
                                mode: 'range',
                                dateFormat: 'd-m-Y',
                                position: 'auto right',
                                onClose: (selectedDates, dateStr, instance) => {
                                    setDate3(selectedDates); // Assuming setDate3 is your state updater function
                                    setActiveFilter(!activeFilter)
                                },

                            }}
                            // defaultValue={''}
                            placeholder="Please select a date range..."
                            className="form-input w-60"
                            onChange={(date3: any) => setDate3(date3)}
                        />
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

                    </div>

                </div>
                <div className="pl-1 datatables pagination-padding">
                    <DataTable
                        className={`${isDark} table-hover whitespace-nowrap`}
                        records={records?.map((ticket, index) => ({
                            ...ticket,
                            serialNumber: index + 1,
                        }))}
                        columns={[
                            {
                                accessor: 'id',
                                // sortable: true,
                                render: ({ serialNumber, ticket_id }) => (
                                    <Link href={`#`}>
                                        <div className="font-semibold text-primary underline hover:no-underline">{`#${serialNumber}`}</div>
                                    </Link>
                                ),
                            },
                            {
                                accessor: 'assigned_agent',
                                sortable: true,
                                render: ({ assigned_agent, ticket_id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div className="w-max rounded-full bg-white-dark/30 p-0.5 ltr:mr-2 rtl:ml-2">
                                            <Image
                                                width={32}
                                                height={32}
                                                className="h-8 w-8 rounded-full object-cover"
                                                src={`${assigned_agent.profile_pic ? IMG_URL + assigned_agent.profile_pic : '/assets/images/profile-pic.png'}`}
                                                alt="agent-picture" />
                                        </div>
                                        <div>{assigned_agent?.first_name} {assigned_agent?.last_name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Ticket Title',
                                sortable: true,
                                render: ({ title }) => <div >{title}</div>,
                            },
                            {
                                accessor: 'description',
                                sortable: true,
                                render: ({ description }) =>
                                    <div className=" font-medium  text-white-dark ">
                                        <span >
                                            {description.startsWith('<html>') ? '- Created by Email -' : truncateText(description, 40)}
                                        </span>
                                    </div>,
                            },
                            {
                                accessor: 'Created Date',
                                sortable: true,
                                render: ({ timestamp }) => <span >{formatDate(timestamp)}</span>,
                            },
                            {
                                accessor: 'client_phonenumber',
                                sortable: true,
                                render: (ticket) => <div className='text-center cursor-pointer hover:font-semibold hover:text-primary'
                                    onClick={() => {
                                        //@ts-ignore
                                        dispatch(updateTicketState({ ...defaultParams, client_phonenumber: ticket.client_phonenumber?.id })),
                                            dispatch(setTicketModal(true)),
                                            dispatch(fetchAllCategoryAsync({}))
                                    }}>
                                    {ticket.client_phonenumber ? typeof ticket.client_phonenumber !== 'number' && ticket.client_phonenumber?.phone_number : 'N/A'}
                                </div>,
                            },
                            /* {
                                accessor: 'flag',
                                sortable: true,
                                render: ({ flag }) => <span className={`font-semibold 
                                ${flag === 'Important' ? 'text-yellow-500'
                                        : flag === 'Moderate' ? 'text-green-500'
                                            : flag === 'Least Important' ? 'text-blue-500'
                                                : flag === 'Prank' ? 'text-red-500' : ''}`}>{flag}</span>,
                            }, */
                            {
                                accessor: 'category',
                                sortable: true,
                                render: ({ cat }) => <span className={`font-semibold`}>{typeof cat === 'object' ? cat.title : cat}</span>,
                            },
                            {
                                accessor: 'status',
                                sortable: true,
                                render: ({ status }) => <span className={`badge 
                                badge-outline-${status === 'Pending' ? 'dark'
                                        : status === 'Active' ? 'secondary'
                                            : status === 'Resolved' ? 'success'
                                                : status === 'Cancelled' ? 'warning'
                                                    : status === 'Escalated' ? 'danger' : ''}`}>{status}</span>,
                            },
                            {
                                accessor: 'proirity',
                                sortable: true,
                                render: ({ priority }) => <span className={`badge 
                                bg-${priority === 'High' ? 'success'
                                        : priority === 'Medium' ? 'primary'
                                            : priority === 'Low' ? 'warning'
                                                : priority === 'Critical' ? 'danger' : ''}`}>{priority}</span>,
                            },
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: (ticket) => (
                                    <div className="mx-auto flex w-max items-center gap-4">
                                        <button
                                            type="button"
                                            className="flex hover:text-info"
                                            onClick={() => {
                                                //@ts-ignore
                                                dispatch(updateTicketState({ ...ticket, cat: ticket.cat.id })),
                                                    dispatch(setTicketModal(true)),
                                                    dispatch(fetchAllCategoryAsync({}))
                                            }}
                                        >
                                            <EditIcon />
                                        </button>
                                        <Link href={`/ticket/${ticket.ticket_id}`} className="flex hover:text-primary">
                                            <PreviewIcon />
                                        </Link>
                                        <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(ticket?.ticket_id)}>
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={tickets.count}
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
        </div>
    );
};

export default TicketTable;
