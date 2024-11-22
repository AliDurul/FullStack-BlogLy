import { Ticket } from '@/types/types';
import { formatDate, truncateText } from '@/utils/helperFunctions';
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar';

interface KycUserTicketsInfoProps {
    userTickets: Ticket[];
    summaryArray: { title: string, value: number, customStyle: string }[];
}

const KycUserTicketsInfo = ({ userTickets, summaryArray }: KycUserTicketsInfoProps) => {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {
                userTickets.length > 0 && (
                    <div className="panel">
                        <div className="mb-10 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Summary Of User Tickets</h5>
                            <p className="flex items-center rounded-full bg-dark px-2 py-1 text-xs font-semibold text-white-light">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-1 rtl:ml-1">
                                    <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Total Tickets {userTickets.length}
                            </p>
                        </div>
                        <div className="space-y-4">
                            {
                                summaryArray.map((item, i) => (
                                    <div key={i} className="rounded border border-[#ebedf2] dark:border-0 dark:bg-[#1b2e4b] cursor-pointer">
                                        <div className="flex items-center justify-between p-4 py-2">
                                            <div className={`grid h-9 w-9 place-content-center rounded-md ${item.customStyle} dark:bg-secondary dark:text-secondary-light`}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M4.72848 16.1369C3.18295 14.5914 2.41018 13.8186 2.12264 12.816C1.83509 11.8134 2.08083 10.7485 2.57231 8.61875L2.85574 7.39057C3.26922 5.59881 3.47597 4.70292 4.08944 4.08944C4.70292 3.47597 5.59881 3.26922 7.39057 2.85574L8.61875 2.57231C10.7485 2.08083 11.8134 1.83509 12.816 2.12264C13.8186 2.41018 14.5914 3.18295 16.1369 4.72848L17.9665 6.55812C20.6555 9.24711 22 10.5916 22 12.2623C22 13.933 20.6555 15.2775 17.9665 17.9665C15.2775 20.6555 13.933 22 12.2623 22C10.5916 22 9.24711 20.6555 6.55812 17.9665L4.72848 16.1369Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <circle opacity="0.5" cx="8.60699" cy="8.87891" r="2" transform="rotate(-45 8.60699 8.87891)" stroke="currentColor" strokeWidth="1.5" />
                                                    <path opacity="0.5" d="M11.5417 18.5L18.5208 11.5208" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-auto items-start justify-between font-semibold ltr:ml-4 rtl:mr-4">
                                                <h6 className="text-[13px] text-white-dark dark:text-white-dark">
                                                    {item.title}
                                                    {/* <span className="block text-base text-[#515365] dark:text-white-light">$92,600</span> */}
                                                </h6>
                                                <p className="text-secondary ltr:ml-auto rtl:mr-auto">{item.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }

            {
                userTickets.length > 0 && (
                    <div className="panel pb-0 w-full " >
                        <div className="-mx-5 mb-5 flex items-start justify-between border-b border-white-light p-5 pt-0  dark:border-[#1b2e4b] dark:text-white-light">
                            <h5 className="text-lg font-semibold ">Lastest Activity</h5>
                        </div>
                        <PerfectScrollbar className="perfect-scrollbar relative  -mr-3  pr-3 mb-4 h-[calc(100vh-40rem)]">
                            <div className="space-y-7">
                                {
                                    userTickets.map((c, i, arr) => {
                                        const isLast = i === arr.length - 1;
                                        return (
                                            <div className="flex" key={c.ticket_id}>
                                                <div className={`relative z-10 ${!isLast ? 'before:absolute before:top-10 before:left-4 before:h-[calc(100%-24px)] before:w-[2px] before:bg-white-dark/30' : ''} ltr:mr-2 rtl:ml-2`}>
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full  text-white shadow shadow-secondary">

                                                    </div>
                                                </div>
                                                <div >
                                                    <h5 className=" dark:text-white-light">
                                                        {/* @ts-ignore */}
                                                        Ticket created by <button type="button" className='font-semibold'>{c.assigned_agent}</button> : {' '}
                                                        <button type="button" className={`${c?.status === 'Active'
                                                            ? 'text-secondary'
                                                            : c?.status === 'Escalated'
                                                                ? 'text-warning'
                                                                : c?.status === 'Cancelled'
                                                                    ? 'text-danger'
                                                                    : c?.status === 'Pending'
                                                                        ? 'text-info'
                                                                        : c?.status === 'Resolved'
                                                                            ? 'text-success' : ''
                                                            } `}>
                                                            {`[${truncateText(c.description, 80)}]`}
                                                        </button>
                                                    </h5>
                                                    <p className="text-xs text-white-dark">{formatDate(c.timestamp)}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </PerfectScrollbar>
                    </div>
                )
            }

        </div>
    )
}

export default KycUserTicketsInfo