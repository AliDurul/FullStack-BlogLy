import Image from 'next/image';
import React from 'react'
import PreviewButtons from '../components/InvoicePreview';
import { readInvoice } from '@/lib/features/invoices/invoiceAPI';
import { formatDate } from '@/utils/helperFunctions';
import { notFound } from 'next/navigation';
import TopPageNavigation from '@/app/components/TopPageNavigation';

// metadata title
export async function generateMetadata({ params }: { params: { invoiceId: string } }) {
    const invoice = await readInvoice(params.invoiceId)

    if (!invoice.customer?.first_name) {
        return { title: 'Invoice Not Found' }
    }

    return {
        title: `Invoice of ${invoice?.customer?.first_name}`,
        description: `This is the Invoice page of ${invoice?.customer?.first_name}`
    }
}



export default async function InvoicePreviewPage({ params }: { params: { invoiceId: string } }) {
    const invoice = await readInvoice(params.invoiceId)

    if (!invoice?.customer?.first_name) notFound()


    const columns = [
        {
            key: 'id',
            label: 'Id',
        },
        {
            key: 'title',
            label: 'Product Names',
        },
        {
            key: 'quantity',
            label: 'QTY',
        },
        {
            key: 'price',
            label: 'PRICE',
            class: 'ltr:text-right rtl:text-left',
        },
        {
            key: 'discounts',
            label: 'DISCOUNT',
            class: 'ltr:text-right rtl:text-left',
        },
        {
            key: 'total_price',
            label: 'AMOUNT',
            class: 'ltr:text-right rtl:text-left',
        },
    ];

    return (
        <div className="flex flex-col space-y-5">
            <TopPageNavigation />


            <div>
                <PreviewButtons invoice={invoice} />
                <div className="panel printBody">   
                    <div className="flex flex-wrap justify-between gap-4 px-4">
                        <div className="text-2xl font-semibold uppercase">Invoice</div>
                        <div className="shrink-0">
                            <Image src="/assets/images/client-link.png" className="ltr:ml-auto rtl:mr-auto" alt="img" width={120} height={120} />
                        </div>
                    </div>
                    <div className="px-4 ltr:text-right rtl:text-left">
                        <div className="mt-6 space-y-1 text-white-dark">
                            <div>3nd Floor,Finance House, Hero's Place, Lusaka, Zambia</div>
                            <div>clientLinko@gmail.com</div>
                            <div>+260 (970) 732-4567</div>
                        </div>
                    </div>
                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                    <div className="flex flex-col flex-wrap justify-between gap-4 lg:flex-row">
                        <div className="flex-1">
                            <div className="space-y-1 text-white-dark">
                                <div>Issue For:</div>
                                <div className="font-semibold text-black dark:text-white">{invoice?.customer?.first_name} {invoice?.customer?.last_name}</div>
                                <div>{invoice?.customer?.location}</div>
                                <div>{invoice?.customer?.email}</div>
                                <div>{invoice?.customer?.phone_number}</div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-6 sm:flex-row lg:w-2/3">
                            <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Invoice :</div>
                                    <div>#8701</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Issue Date :</div>
                                    <div>{formatDate(invoice?.timestamp)}</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Due Date :</div>
                                    <div>{formatDate(invoice?.amount_due)}</div>
                                </div>
                                {/* <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Order ID :</div>
                                    <div>#OD-85794</div>
                                </div> */}
                                {/* <div className="flex w-full items-center justify-between">
                                    <div className="text-white-dark">Shipment ID :</div>
                                    <div>#SHP-8594</div>
                                </div> */}
                            </div>
                            <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Payment Type:</div>
                                    <div className="whitespace-nowrap">{invoice?.payment_terms}</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Account Number:</div>
                                    <div>1234567890</div>
                                </div>
                                {/* <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">SWIFT Code:</div>
                                    <div>S58K796</div>
                                </div> */}
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">IBAN:</div>
                                    <div>L5698445485</div>
                                </div>
                                {/* <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Country:</div>
                                    <div>United States</div>
                                </div> */}
                            </div>
                        </div>

                    </div>
                    {
                        invoice.additional_notes && (
                            <div className='mt-3'>
                                <div className='text-center' >Additional Notes</div>
                                <p className="text-white-dark">{invoice.additional_notes}</p>
                            </div>
                        )

                    }
                    <div className="table-responsive mt-6">
                        <table className="table-striped">
                            <thead>
                                <tr>
                                    {columns.map((column) => {
                                        return (
                                            <th key={column.key} className={column?.class}>
                                                {column.label}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {invoice?.invoice_items?.map((item: any, i: number) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{item?.id}</td>
                                            <td>{item.product?.name}</td>
                                            <td>{item.quantity}</td>
                                            <td className="ltr:text-right rtl:text-left">{item.product?.price}</td>
                                            <td className="ltr:text-right rtl:text-left">${item.discounts}</td>
                                            <td className="ltr:text-right rtl:text-left">${(item.quantity * item.product?.price) - item.discounts}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 grid grid-cols-1 px-4 sm:grid-cols-2">
                        <div></div>
                        <div className="space-y-2 ltr:text-right rtl:text-left">
                            {/* <div className="flex items-center">
                                <div className="flex-1">Subtotal</div>
                                <div className="w-[37%]">$3255</div>
                            </div> */}
                            <div className="flex items-center">
                                <div className="flex-1">Tax</div>
                                <div className="w-[37%]">%{invoice.taxes}</div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1">Shipping Rate</div>
                                <div className="w-[37%]">${invoice.shipping_costs}</div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1">Discount</div>
                                <div className="w-[37%]">${invoice.total_discount}</div>
                            </div>
                            <div className="flex items-center text-lg font-semibold">
                                <div className="flex-1">Grand Total</div>
                                <div className="w-[37%]">${invoice.total_price}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

/* export async function generateStaticParams() {
    const dispatch = useAppDispatch();
    dispatch(fetchAllInvoicesAsync({}));
    const invoices = useAppSelector(selectInvoices);
    return invoices.map(invoice => { invoiceId: invoice.id.toString() })
} */