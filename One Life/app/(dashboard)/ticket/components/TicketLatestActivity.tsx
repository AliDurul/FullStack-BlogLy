'use client'
import { getTicketComments } from '@/lib/features/tickets/ticketAPI';
import { selectTicket, selectTicketComments, updateticketComments } from '@/lib/features/tickets/ticketSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Ticket, TicketComments } from '@/types/types';
import { formatDate, truncateText } from '@/utils/helperFunctions';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar';



export default function TicketLatestActivity() {

    const ticket = useAppSelector(selectTicket);

    const ticketComments = useAppSelector(selectTicketComments);
    const dispatch = useAppDispatch();

    const reversedComments = [...(ticketComments?.comments || [])].reverse()


    const escalationInfo = {
        firstName: ticket.escalation && typeof ticket.escalation?.raised_by !== "number" ? ticket.escalation?.raised_by?.first_name : '',
        reosan: ticket.escalation ? ticket?.escalation?.reason : '',
        date: ticket.escalation && ticket.escalation?.escalated_at
    }

    return (
        <div className="panel sm:col-span-1 sm:row-span-2 lg:col-span-1 lg:row-span-2  pb-0 relative " >
            <div className="-mx-5 mb-5 flex items-start justify-between border-b border-white-light p-5 pt-0  dark:border-[#1b2e4b] dark:text-white-light">
                <h5 className="text-lg font-semibold ">Lastest Activity</h5>
            </div>
            <PerfectScrollbar className="perfect-scrollbar h-5/6 -mr-3  pr-3">
                <div className="space-y-7">
                    {
                        reversedComments.map((c, i, arr) => {
                            const isLast = i === arr.length - 1;
                            return (
                                <div className="flex">
                                    <div className={`relative z-10 ${!isLast ? 'before:absolute before:top-10 before:left-4 before:h-[calc(100%-24px)] before:w-[2px] before:bg-white-dark/30' : ''} ltr:mr-2 rtl:ml-2`}>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white shadow shadow-secondary">

                                        </div>
                                    </div>
                                    <div key={c.id}>
                                        <h5 className=" dark:text-white-light">
                                            Comment created by <button type="button" className='font-semibold'>{c.user.first_name}</button> : {' '}
                                            <button type="button" className="text-success">
                                                {`[${truncateText(c.body, 25)}]`}
                                            </button>
                                        </h5>
                                        <p className="text-xs text-white-dark">{formatDate(c.timestamp, true)}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        ticket.status === 'Escalated' && (
                            <div className="flex">
                                <div className={`relative z-10 ltr:mr-2 rtl:ml-2`}>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger text-white shadow shadow-secondary">

                                    </div>
                                </div>
                                <div>
                                    <h5 className=" dark:text-white-light">
                                        Escalated by <button type="button" className='font-semibold'>{escalationInfo.firstName}</button> : {' '}
                                        <button type="button" className="text-danger">
                                            {`[${truncateText(escalationInfo.reosan, 25)}]`}
                                        </button>
                                    </h5>
                                    <p className="text-xs text-white-dark">{formatDate(escalationInfo.date)}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </PerfectScrollbar>
            <div className="">
                <Link href={`/ticket/activity/${ticket.ticket_id}`} type="button" className="group  flex w-full items-center justify-center p-4 font-semibold hover:text-primary border-t border-white-light dark:border-white/10">
                    View All
                    <svg
                        className="h-4 w-4 transition duration-300 group-hover:translate-x-1 ltr:ml-1 rtl:mr-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}
