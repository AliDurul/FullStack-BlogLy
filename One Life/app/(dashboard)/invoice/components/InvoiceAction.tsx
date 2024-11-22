'use client'
import { createInvoice, updateInvoice } from '@/lib/features/invoices/invoiceAPI';
import { fetchAllInvoicesAsync, selectInvoice, updateInvoiceState } from '@/lib/features/invoices/invoiceSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { coloredToast } from '@/utils/sweetAlerts';
import { Field, Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { fetchAllKycAsync, selectKycs } from '@/lib/features/kyc/kycSlice';
import { fetchAllProductAsync, selectProducts } from '@/lib/features/products/productSlice';

const InvoiceAction = () => {
    const dispatch = useAppDispatch();
    const router = useRouter()
    const invoice = useAppSelector(selectInvoice);
    const customers = useAppSelector(selectKycs);
    const products = useAppSelector(selectProducts);

    useEffect(() => {
        dispatch(fetchAllKycAsync({ type: 'Customer' }))
        dispatch(fetchAllProductAsync({}))
    }, [])


    const customerOP = customers.results?.map((customer) => ({
        label: `${customer.first_name} ${customer.last_name}`,
        value: customer.id
    }))

    const productOP = products.results?.map((product) => ({
        label: product.name,
        value: product.id,
        price: product.price
    }))

    const statusOp = [
        { label: 'Draft', value: 'Draft' },
        { label: 'Sent', value: 'Sent' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Refunded', value: 'Refunded' },
        { label: 'Overdue', value: 'Overdue' },
        { label: 'Closed', value: 'Closed' },
    ]
    const paymentOp = [
        { label: 'Cash', value: 'Cash' },
        { label: 'Cheque', value: 'Cheque' },
        { label: 'Credit Card', value: 'Credit Card' },
        { label: 'Debit Card', value: 'Debit Card' },
        { label: 'Paypal', value: 'Paypal' },
        { label: 'Stripe', value: 'Stripe' },
        { label: 'Mobile', value: 'Mobile' },
    ]


    const getTotalDiscounts = (invoiceItems: any[]) => {
        return invoiceItems.reduce((acc, item) => acc + item.discounts, 0);
    };


    const calculateItemSubtotal = (price: string, quantity: string, discount: string) => {
        const priceNumber = parseFloat(price);
        const quantityNumber = parseInt(quantity, 10);
        const discountNumber = parseFloat(discount);

        return (priceNumber * quantityNumber) - discountNumber;
    };

    const calculateTotalSubtotal = (invoiceItems: any[], shippingCost: number) => {
        return invoiceItems.reduce((total, item) => {
            const itemSubtotal = calculateItemSubtotal(item.product.price, item.quantity, item.discounts);
            return (total + itemSubtotal) - shippingCost;
        }, 0);
    };

    const formatDateForInput = (dateString: any) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JS months are zero-indexed
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const initialValueCustomer = customers.results?.find(customer => customer.id === invoice?.customer.id);


    const [selectedCustomer, setSelectedCustomer] = useState(initialValueCustomer);

    const initialValues = {
        id: invoice?.id || 0,
        customer: invoice?.customer || 0,
        status: invoice?.status || 'Draft',
        shipping_costs: invoice?.shipping_costs || '0.00',
        taxes: invoice?.taxes || '16',
        amount_due: formatDateForInput(invoice?.amount_due) || new Date().toISOString(),
        payment_terms: invoice?.payment_terms || '',
        additional_notes: invoice?.additional_notes || '',
        invoice_items: invoice?.invoice_items.map(item => ({
            id: item.id,
            product: {
                id: item.product?.id,
                name: item.product?.name,
                price: item.product?.price,
            },
            quantity: item.quantity,
            discounts: item.discounts
        })) || [
                {
                    id: 1,
                    product: {
                        id: 0,
                        name: '',
                        price: 0,
                    },
                    quantity: 1,
                    discounts: 0,
                },
            ]
    };


    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                if (invoice) {
                    const { invoice_items, customer, ...valuesToSend } = values
                    //@ts-ignore
                    const res = await updateInvoice(valuesToSend)
                    setTimeout(() => {
                        if (res.message) {
                            setSubmitting(false);
                            resetForm();
                            router.replace('/invoice')
                            coloredToast("success", res.message, "bottom-start");
                            dispatch(updateInvoiceState(null))
                        } else {
                            coloredToast("danger", res.error, "bottom-start");
                        }
                    }, 500);
                } else {
                    const transformedItems = values.invoice_items.map(item => ({
                        product: item.product.id,
                        quantity: Number(item.quantity),
                        discounts: Number(item.discounts)
                    }));
                    const { id, ...valuesToSend } = values
                    const payload = { ...valuesToSend, invoice_items: transformedItems };

                    const res = await createInvoice(payload);
                    
                    setTimeout(() => {
                        setSubmitting(false);
                        if (res.message) {
                            coloredToast("success", res.message, "bottom-start");
                            router.replace('/invoice')
                            resetForm();
                            dispatch(fetchAllInvoicesAsync({}));
                        } else {
                            coloredToast("danger", res.error, "bottom-start");
                        }
                    }, 500);
                }

            }}
        >
            {
                ({ values, setFieldValue }) => (

                    <Form className="flex flex-col gap-2.5 xl:flex-row mt-5">
                        <div className="panel flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                            <div className="flex flex-wrap justify-between px-4">
                                <div className="mb-6 w-full lg:w-1/2">
                                    <div className="flex shrink-0 items-center text-black dark:text-white">
                                        <Image src="/assets/images/client-link.png" alt="img" width={150} height={50} />
                                    </div>
                                    <div className="mt-6 space-y-1 text-gray-500 dark:text-gray-400">
                                        <div>2rd Floor, Paylink, Cairo road, Lusaka, Zambia</div>
                                        <div>info@paylinkzm.com</div>
                                        <div>+260 21144500(0/1) or 5500</div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 lg:max-w-fit">
                                    <div className="flex items-center">
                                        <label htmlFor="number" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                            Invoice Number
                                        </label>
                                        <input id="number" type="text" name="inv-num" className="form-input w-2/3 lg:w-[250px]" readOnly />
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <label htmlFor="amount_due" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                            Due Date
                                        </label>
                                        <Field name='amount_due' id="amount_due" type="date" className="form-input w-2/3 lg:w-[250px]" required />
                                    </div>
                                </div>
                            </div>
                            <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                            <div className="mt-8 px-4">
                                <div className="flex flex-col justify-between lg:flex-row">
                                    <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                                        <div className="text-lg">Bill To :-</div>
                                        <div className="mt-4 flex items-center">
                                            <label htmlFor="reciever-name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                                Select Customer
                                            </label>
                                            <Select placeholder="Select The Customer" options={customerOP}
                                                // @ts-ignore
                                                value={customerOP.find(option => option.value === values.customer?.id)}
                                                onChange={option => {
                                                    setFieldValue('customer', option ? option.value : '');
                                                    const selectedCustomer = customers.results?.find(customer => customer.id === option?.value);
                                                    // @ts-ignore
                                                    setSelectedCustomer(selectedCustomer || null);
                                                }}
                                                className='flex-1'
                                                required
                                            />
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <label htmlFor="reciever-name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                                Name
                                            </label>
                                            <input
                                                id="reciever-name"
                                                type="text"
                                                name="reciever-name"
                                                className="form-input flex-1"
                                                // @ts-ignore
                                                value={selectedCustomer ? `${selectedCustomer?.first_name} ${selectedCustomer.last_name}` : ''}
                                                placeholder="Enter Name" />
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <label htmlFor="reciever-email" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                                Email
                                            </label>
                                            <input id="reciever-email" type="email" name="reciever-email" className="form-input flex-1" placeholder="Enter Email"
                                                // @ts-ignore
                                                value={selectedCustomer ? `${selectedCustomer?.email}` : ''}
                                            />
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <label htmlFor="reciever-address" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                                Address
                                            </label>
                                            <input id="reciever-address" type="text" name="reciever-address" className="form-input flex-1" placeholder="Enter Address"
                                                // @ts-ignore
                                                value={selectedCustomer ? `${selectedCustomer?.location}` : ''}
                                            />
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <label htmlFor="reciever-number" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                                Phone Number
                                            </label>
                                            <input id="reciever-number" type="text" name="reciever-number" className="form-input flex-1" placeholder="Enter Phone number"
                                                // @ts-ignore
                                                value={selectedCustomer ? `${selectedCustomer?.phone_number}` : ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2">
                                        <div className="text-lg">Payment Details:</div>
                                        <div className="mt-4 flex items-center">
                                            <label htmlFor="acno" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                                Status
                                            </label>
                                            <Select placeholder="Select The Status" options={statusOp}
                                                value={statusOp.find(option => option.value === values.status)}
                                                onChange={option => { setFieldValue('status', option ? option.value : ''); }}
                                                className='flex-1'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="" >
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th className="w-1">Quantity</th>
                                                <th className="w-1">Price</th>
                                                <th className="w-1">Disscount</th>
                                                <th>Total</th>
                                                <th className="w-1"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {values.invoice_items.length <= 0 && (
                                                <tr>
                                                    <td colSpan={5} className="!text-center font-semibold">
                                                        No Item Available
                                                    </td>
                                                </tr>
                                            )}
                                            {values.invoice_items.map((item, index) => {
                                                return (
                                                    <tr className="align-top" key={item.id}>
                                                        <td>
                                                            <Field
                                                                as={Select} placeholder="Select The Product"
                                                                name={`invoice_items[${index}].product.id`}
                                                                options={productOP}
                                                                value={productOP.find(option => option.value === item.product.id)}
                                                                //@ts-ignore
                                                                onChange={option => {
                                                                    setFieldValue(`invoice_items[${index}].product.id`, option ? option.value : '');
                                                                    setFieldValue(`invoice_items[${index}].product.price`, option ? option.price : 0);
                                                                }}
                                                                className="min-w-[200px] "
                                                                required
                                                            />

                                                        </td>
                                                        <td>
                                                            <Field
                                                                name={`invoice_items[${index}].quantity`}
                                                                type="number"
                                                                className="form-input w-32"
                                                                placeholder="Quantity"
                                                                min={0}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Field
                                                                name={`invoice_items[${index}].product.price`}
                                                                type="number"
                                                                className="form-input w-32"
                                                                placeholder="Price"
                                                                min={0}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td>
                                                            <Field
                                                                name={`invoice_items[${index}].discounts`}
                                                                type="number"
                                                                className="form-input w-32"
                                                                placeholder="Disscount"
                                                                min={0}
                                                            />
                                                        </td>
                                                        <td >${(values.invoice_items[index].quantity * values.invoice_items[index].product.price) - values.invoice_items[index].discounts}</td>
                                                        <td>
                                                            <button type="button" onClick={() => {
                                                                const newItems = values.invoice_items.filter((item, i) => i !== index);
                                                                setFieldValue('invoice_items', newItems);
                                                            }}>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="20"
                                                                    height="20"
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
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-6 flex flex-col justify-between px-4 sm:flex-row">
                                    <div className="mb-6 sm:mb-0">
                                        <button type="button" className="btn btn-primary" onClick={() => {
                                            const newItem = {
                                                id: values.invoice_items.length + 1,
                                                product: {
                                                    id: 0,
                                                    name: '',
                                                    price: 0,
                                                },
                                                quantity: 1,
                                                discounts: 0,
                                            }
                                            const newItems = [...values.invoice_items, newItem];
                                            setFieldValue('invoice_items', newItems);
                                        }}>
                                            Add Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 px-4">
                                <label htmlFor="notes">Notes</label>
                                <Field as='textarea' id="notes" name="additional_notes" className="form-textarea min-h-[130px]" placeholder="Notes...."></Field>
                            </div>
                        </div>
                        <div className="mt-6 w-full xl:mt-0 xl:w-96">
                            <div className="panel mb-5">
                                <div>
                                    <div>
                                        <label htmlFor="shipping_costs">Shipping Charge($) </label>
                                        <Field id="shipping_costs" type="number" name="shipping_costs" className="form-input" defaultValue={0} placeholder="Shipping Charge" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="payment-method">Accept Payment Via</label>
                                    <Select placeholder="Select The Payment" options={paymentOp}
                                        value={paymentOp.find(option => option.value === values.payment_terms)}
                                        onChange={option => { setFieldValue('payment_terms', option ? option.value : ''); }}
                                        className='flex-1'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="panel">
                                <div className=''>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>Tax(%)</div>
                                        <div>{values.taxes}%</div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>Shipping Rate($)</div>
                                        <div>${values.shipping_costs}</div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>Discount($)</div>
                                        <div>${getTotalDiscounts(values.invoice_items)}</div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between font-semibold">
                                        <div>Total</div>
                                        <div>${calculateTotalSubtotal(values.invoice_items, Number(values.shipping_costs))}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1 mt-4">

                                    <button type="submit" className="btn btn-success w-full gap-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                            <path
                                                d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                d="M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path opacity="0.5" d="M7 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                )
            }

        </Formik>
    );
};

export default InvoiceAction;
