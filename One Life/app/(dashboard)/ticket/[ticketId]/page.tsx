"use client"
import TicketReview from '../components/TicketReview';
import TicketLatestActivity from '../components/TicketLatestActivity';
import Link from 'next/link';
import { getTicketComments, readTicket } from '@/lib/features/tickets/ticketAPI';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectTicket, updateTicketState, updateticketComments } from '@/lib/features/tickets/ticketSlice';
import { useEffect, useState } from 'react';
import TopPageNavigation from '@/app/components/TopPageNavigation';
import TicketEscForm from '../components/TicketEscForm';
import { selectIsDarkMode } from '@/lib/features/themeConfig/themeConfigSlice';
import ReactApexChart from 'react-apexcharts';

export default function TicketPreviewPage({ params }: { params: { ticketId: string } }) {

    const ticket = useAppSelector(selectTicket);
    const isDark = useAppSelector(selectIsDarkMode)
    const [isMounted, setIsMounted] = useState(false);
    const dispatch = useAppDispatch();


    const fetchAllComments = async () => {
        const data = await getTicketComments(params.ticketId);
        dispatch(updateticketComments(data));
    }
    const fetchTicket = async () => {
        const ticket = await readTicket(params.ticketId)
        dispatch(updateTicketState(ticket))
    }

    useEffect(() => {
        fetchTicket()
        fetchAllComments();
        setIsMounted(true)
    }, [])


    //Sales By Category
    const salesByCategory: any = {
        series: [3, 5, 7],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Mobile Banking', 'kiddies saving', 'Others'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    return (
        <>
            <TopPageNavigation />

            {/* <div className="mt-5 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-none lg:grid-rows-1">
                <TicketReview />
                <TicketEscForm />
                <TicketLatestActivity />
            </div>
            <div className='flex'>
                <div className="panel ">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Recent Orders</h5>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Agents</th>
                                    <th>Product</th>
                                    <th>Invoice</th>
                                    <th>Price</th>
                                    <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-6.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Luke Ivory</span>
                                        </div>
                                    </td>
                                    <td className="text-primary">Uba kiddies saving </td>
                                    <td>
                                        <Link href="/apps/invoice/preview">#46894</Link>
                                    </td>
                                    <td>$56.07</td>
                                    <td>
                                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                    </td>
                                </tr>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-7.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Andy King</span>
                                        </div>
                                    </td>
                                    <td className="text-info">Nike Sport</td>
                                    <td>
                                        <Link href="/apps/invoice/preview">#76894</Link>
                                    </td>
                                    <td>$126.04</td>
                                    <td>
                                        <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Pending</span>
                                    </td>
                                </tr>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-8.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Laurie Fox</span>
                                        </div>
                                    </td>
                                    <td className="text-warning">SME Domiciliary</td>
                                    <td>
                                        <Link href="/apps/invoice/preview">#66894</Link>
                                    </td>
                                    <td>$56.07</td>
                                    <td>
                                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                    </td>
                                </tr>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-9.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Ryan Collins</span>
                                        </div>
                                    </td>
                                    <td className="text-danger">UBA SME</td>
                                    <td>
                                        <button type="button">#75844</button>
                                    </td>
                                    <td>$110.00</td>
                                    <td>
                                        <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Pending</span>
                                    </td>
                                </tr>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-10.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Irene Collins</span>
                                        </div>
                                    </td>
                                    <td className="text-secondary">UBA SME</td>
                                    <td>
                                        <Link href="/apps/invoice/preview">#46894</Link>
                                    </td>
                                    <td>$56.07</td>
                                    <td>
                                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
                <div className="panel ">
                    <div className="mb-5 flex items-center">
                        <h5 className="text-lg font-semibold dark:text-white-light">Sales By Category</h5>
                    </div>
                    <div>
                        <div className="rounded-lg bg-white dark:bg-black">
                            {isMounted ? (
                                <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                            ) : (
                                <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="mt-5 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-none lg:grid-rows-1">
                <TicketReview />
                <TicketEscForm />
                <TicketLatestActivity />
                <div className="panel sm:col-span-2 sm:row-start-2 lg:col-span-2 lg:row-start-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Recent Orders</h5>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Agents</th>
                                    <th>Product</th>
                                    <th>Invoice</th>
                                    <th>Price</th>
                                    <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                                </tr>
                            </thead>
                            {/* <tbody>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-6.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Luke Ivory</span>
                                        </div>
                                    </td>
                                    <td className="text-primary">Uba kiddies saving </td>
                                    <td>
                                        <Link href="/apps/invoice/preview">#46894</Link>
                                    </td>
                                    <td>$56.07</td>
                                    <td>
                                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                    </td>
                                </tr>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-7.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Andy King</span>
                                        </div>
                                    </td>
                                    <td className="text-info">Nike Sport</td>
                                    <td>
                                        <Link href="/apps/invoice/preview">#76894</Link>
                                    </td>
                                    <td>$126.04</td>
                                    <td>
                                        <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Pending</span>
                                    </td>
                                </tr>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-8.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Laurie Fox</span>
                                        </div>
                                    </td>
                                    <td className="text-warning">SME Domiciliary</td>
                                    <td>
                                        <Link href="/apps/invoice/preview">#66894</Link>
                                    </td>
                                    <td>$56.07</td>
                                    <td>
                                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                    </td>
                                </tr>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-9.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Ryan Collins</span>
                                        </div>
                                    </td>
                                    <td className="text-danger">UBA SME</td>
                                    <td>
                                        <button type="button">#75844</button>
                                    </td>
                                    <td>$110.00</td>
                                    <td>
                                        <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Pending</span>
                                    </td>
                                </tr>
                                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-10.jpeg" alt="avatar" />
                                            <span className="whitespace-nowrap">Irene Collins</span>
                                        </div>
                                    </td>
                                    <td className="text-secondary">UBA SME</td>
                                    <td>
                                        <Link href="/apps/invoice/preview">#46894</Link>
                                    </td>
                                    <td>$56.07</td>
                                    <td>
                                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                    </td>
                                </tr>
                            </tbody> */}
                        </table>
                    </div>


                </div>
                <div className="panel sm:col-span-1 sm:row-start-2 lg:col-span-1 lg:row-start-2">
                    <div className="flex items-center">
                        <h5 className="text-lg font-semibold dark:text-white-light">Sales By Category</h5>
                    </div>
                    <div>
                        <div className="rounded-lg bg-white dark:bg-black">
                            {isMounted ? (
                                <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                            ) : (
                                <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}
