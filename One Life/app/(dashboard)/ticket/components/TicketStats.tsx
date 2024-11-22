'use client'
import { getTicketStatus } from '@/lib/features/tickets/ticketAPI';
import { selectTickets } from '@/lib/features/tickets/ticketSlice';
import { useAppSelector } from '@/lib/hooks';
import { TicketStatuses } from '@/types/types';
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';


export default function TicketStats() {
    const [stats, setStats] = useState<TicketStatuses>({
        "total_count": 0,
        "status_counts": {
            "Pending": 0,
            "Active": 0,
            "Resolved": 0,
            "Cancelled": 0,
            "Escalated": 0
        }
    })
    
    const tickets = useAppSelector(selectTickets)


    useEffect(() => {
        (async () => {
            try {
                const res = await getTicketStatus()

                if (res.error) throw new Error(res.error || 'Something went wrong try again later.')

                setStats(res)

            } catch (error: any) {
                console.log(error.message);
            }
        })()
    }, [tickets])


    return (
        <div className="panel py-5 mb-6 flex flex-wrap  items-center justify-around text-gray-900 mt-5">
            <div className="flex justify-center items-center gap-5">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='p-2 bg-secondary-light  text-secondary rounded-2xl '>
                    <path d="M2.5 6.5C2.5 4.29086 4.29086 2.5 6.5 2.5C8.70914 2.5 10.5 4.29086 10.5 6.5V9.16667C10.5 9.47666 10.5 9.63165 10.4659 9.75882C10.3735 10.1039 10.1039 10.3735 9.75882 10.4659C9.63165 10.5 9.47666 10.5 9.16667 10.5H6.5C4.29086 10.5 2.5 8.70914 2.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 14.8333C13.5 14.5233 13.5 14.3683 13.5341 14.2412C13.6265 13.8961 13.8961 13.6265 14.2412 13.5341C14.3683 13.5 14.5233 13.5 14.8333 13.5H17.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7091 19.7091 21.5 17.5 21.5C15.2909 21.5 13.5 19.7091 13.5 17.5V14.8333Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2.5 17.5C2.5 15.2909 4.29086 13.5 6.5 13.5H8.9C9.46005 13.5 9.74008 13.5 9.95399 13.609C10.1422 13.7049 10.2951 13.8578 10.391 14.046C10.5 14.2599 10.5 14.5399 10.5 15.1V17.5C10.5 19.7091 8.70914 21.5 6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 6.5C13.5 4.29086 15.2909 2.5 17.5 2.5C19.7091 2.5 21.5 4.29086 21.5 6.5C21.5 8.70914 19.7091 10.5 17.5 10.5H14.6429C14.5102 10.5 14.4438 10.5 14.388 10.4937C13.9244 10.4415 13.5585 10.0756 13.5063 9.61196C13.5 9.55616 13.5 9.48982 13.5 9.35714V6.5Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className=" flex justify-center flex-col items-center">
                    <div className="text-lg font-semibold text-white-dark ">Active</div>
                    <div className="text-3xl font-[900] text-sky-800 ">
                        <CountUp start={0} end={stats.status_counts.Active} duration={7} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center gap-5">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='p-2  bg-gray-200 text-gray-600  rounded-2xl '>
                    <path d="M2.5 6.5C2.5 4.29086 4.29086 2.5 6.5 2.5C8.70914 2.5 10.5 4.29086 10.5 6.5V9.16667C10.5 9.47666 10.5 9.63165 10.4659 9.75882C10.3735 10.1039 10.1039 10.3735 9.75882 10.4659C9.63165 10.5 9.47666 10.5 9.16667 10.5H6.5C4.29086 10.5 2.5 8.70914 2.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 14.8333C13.5 14.5233 13.5 14.3683 13.5341 14.2412C13.6265 13.8961 13.8961 13.6265 14.2412 13.5341C14.3683 13.5 14.5233 13.5 14.8333 13.5H17.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7091 19.7091 21.5 17.5 21.5C15.2909 21.5 13.5 19.7091 13.5 17.5V14.8333Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2.5 17.5C2.5 15.2909 4.29086 13.5 6.5 13.5H8.9C9.46005 13.5 9.74008 13.5 9.95399 13.609C10.1422 13.7049 10.2951 13.8578 10.391 14.046C10.5 14.2599 10.5 14.5399 10.5 15.1V17.5C10.5 19.7091 8.70914 21.5 6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 6.5C13.5 4.29086 15.2909 2.5 17.5 2.5C19.7091 2.5 21.5 4.29086 21.5 6.5C21.5 8.70914 19.7091 10.5 17.5 10.5H14.6429C14.5102 10.5 14.4438 10.5 14.388 10.4937C13.9244 10.4415 13.5585 10.0756 13.5063 9.61196C13.5 9.55616 13.5 9.48982 13.5 9.35714V6.5Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className=" flex justify-center flex-col items-center">
                    <div className="text-lg font-semibold text-gray-500 ">Pending</div>
                    <div className="text-3xl font-[900] text-sky-800 ">
                        <CountUp start={0} end={stats.status_counts.Pending} duration={7} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center gap-5">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='p-2 bg-success-light  text-success rounded-2xl '>
                    <path d="M2.5 6.5C2.5 4.29086 4.29086 2.5 6.5 2.5C8.70914 2.5 10.5 4.29086 10.5 6.5V9.16667C10.5 9.47666 10.5 9.63165 10.4659 9.75882C10.3735 10.1039 10.1039 10.3735 9.75882 10.4659C9.63165 10.5 9.47666 10.5 9.16667 10.5H6.5C4.29086 10.5 2.5 8.70914 2.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 14.8333C13.5 14.5233 13.5 14.3683 13.5341 14.2412C13.6265 13.8961 13.8961 13.6265 14.2412 13.5341C14.3683 13.5 14.5233 13.5 14.8333 13.5H17.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7091 19.7091 21.5 17.5 21.5C15.2909 21.5 13.5 19.7091 13.5 17.5V14.8333Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2.5 17.5C2.5 15.2909 4.29086 13.5 6.5 13.5H8.9C9.46005 13.5 9.74008 13.5 9.95399 13.609C10.1422 13.7049 10.2951 13.8578 10.391 14.046C10.5 14.2599 10.5 14.5399 10.5 15.1V17.5C10.5 19.7091 8.70914 21.5 6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 6.5C13.5 4.29086 15.2909 2.5 17.5 2.5C19.7091 2.5 21.5 4.29086 21.5 6.5C21.5 8.70914 19.7091 10.5 17.5 10.5H14.6429C14.5102 10.5 14.4438 10.5 14.388 10.4937C13.9244 10.4415 13.5585 10.0756 13.5063 9.61196C13.5 9.55616 13.5 9.48982 13.5 9.35714V6.5Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className=" flex justify-center flex-col items-center">
                    <div className="text-lg font-semibold text-white-dark ">Resolved</div>
                    <div className="text-3xl font-[900] text-sky-800 ">
                        <CountUp start={0} end={stats.status_counts.Resolved} duration={7} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center gap-5">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='p-2  bg-danger-light text-danger  rounded-2xl '>
                    <path d="M2.5 6.5C2.5 4.29086 4.29086 2.5 6.5 2.5C8.70914 2.5 10.5 4.29086 10.5 6.5V9.16667C10.5 9.47666 10.5 9.63165 10.4659 9.75882C10.3735 10.1039 10.1039 10.3735 9.75882 10.4659C9.63165 10.5 9.47666 10.5 9.16667 10.5H6.5C4.29086 10.5 2.5 8.70914 2.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 14.8333C13.5 14.5233 13.5 14.3683 13.5341 14.2412C13.6265 13.8961 13.8961 13.6265 14.2412 13.5341C14.3683 13.5 14.5233 13.5 14.8333 13.5H17.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7091 19.7091 21.5 17.5 21.5C15.2909 21.5 13.5 19.7091 13.5 17.5V14.8333Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2.5 17.5C2.5 15.2909 4.29086 13.5 6.5 13.5H8.9C9.46005 13.5 9.74008 13.5 9.95399 13.609C10.1422 13.7049 10.2951 13.8578 10.391 14.046C10.5 14.2599 10.5 14.5399 10.5 15.1V17.5C10.5 19.7091 8.70914 21.5 6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 6.5C13.5 4.29086 15.2909 2.5 17.5 2.5C19.7091 2.5 21.5 4.29086 21.5 6.5C21.5 8.70914 19.7091 10.5 17.5 10.5H14.6429C14.5102 10.5 14.4438 10.5 14.388 10.4937C13.9244 10.4415 13.5585 10.0756 13.5063 9.61196C13.5 9.55616 13.5 9.48982 13.5 9.35714V6.5Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className=" flex justify-center flex-col items-center">
                    <div className="text-lg font-semibold text-gray-500 ">Escalated</div>
                    <div className="text-3xl font-[900] text-sky-800  ">
                        <CountUp start={0} end={stats.status_counts.Escalated} duration={7} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center gap-5">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='p-2  bg-warning-light text-warning  rounded-2xl '>
                    <path d="M2.5 6.5C2.5 4.29086 4.29086 2.5 6.5 2.5C8.70914 2.5 10.5 4.29086 10.5 6.5V9.16667C10.5 9.47666 10.5 9.63165 10.4659 9.75882C10.3735 10.1039 10.1039 10.3735 9.75882 10.4659C9.63165 10.5 9.47666 10.5 9.16667 10.5H6.5C4.29086 10.5 2.5 8.70914 2.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 14.8333C13.5 14.5233 13.5 14.3683 13.5341 14.2412C13.6265 13.8961 13.8961 13.6265 14.2412 13.5341C14.3683 13.5 14.5233 13.5 14.8333 13.5H17.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7091 19.7091 21.5 17.5 21.5C15.2909 21.5 13.5 19.7091 13.5 17.5V14.8333Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2.5 17.5C2.5 15.2909 4.29086 13.5 6.5 13.5H8.9C9.46005 13.5 9.74008 13.5 9.95399 13.609C10.1422 13.7049 10.2951 13.8578 10.391 14.046C10.5 14.2599 10.5 14.5399 10.5 15.1V17.5C10.5 19.7091 8.70914 21.5 6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 6.5C13.5 4.29086 15.2909 2.5 17.5 2.5C19.7091 2.5 21.5 4.29086 21.5 6.5C21.5 8.70914 19.7091 10.5 17.5 10.5H14.6429C14.5102 10.5 14.4438 10.5 14.388 10.4937C13.9244 10.4415 13.5585 10.0756 13.5063 9.61196C13.5 9.55616 13.5 9.48982 13.5 9.35714V6.5Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className=" flex justify-center flex-col items-center">
                    <div className="text-lg font-semibold text-gray-500 ">Canceled</div>
                    <div className="text-3xl font-[900] text-sky-800  ">
                        <CountUp start={0} end={stats.status_counts.Cancelled} duration={7} />
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center gap-5">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='bg-secondary-light text-secondary rounded-2xl p-2'>
                    <path d="M2.5 6.5C2.5 4.29086 4.29086 2.5 6.5 2.5C8.70914 2.5 10.5 4.29086 10.5 6.5V9.16667C10.5 9.47666 10.5 9.63165 10.4659 9.75882C10.3735 10.1039 10.1039 10.3735 9.75882 10.4659C9.63165 10.5 9.47666 10.5 9.16667 10.5H6.5C4.29086 10.5 2.5 8.70914 2.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 14.8333C13.5 14.5233 13.5 14.3683 13.5341 14.2412C13.6265 13.8961 13.8961 13.6265 14.2412 13.5341C14.3683 13.5 14.5233 13.5 14.8333 13.5H17.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7091 19.7091 21.5 17.5 21.5C15.2909 21.5 13.5 19.7091 13.5 17.5V14.8333Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2.5 17.5C2.5 15.2909 4.29086 13.5 6.5 13.5H8.9C9.46005 13.5 9.74008 13.5 9.95399 13.609C10.1422 13.7049 10.2951 13.8578 10.391 14.046C10.5 14.2599 10.5 14.5399 10.5 15.1V17.5C10.5 19.7091 8.70914 21.5 6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 6.5C13.5 4.29086 15.2909 2.5 17.5 2.5C19.7091 2.5 21.5 4.29086 21.5 6.5C21.5 8.70914 19.7091 10.5 17.5 10.5H14.6429C14.5102 10.5 14.4438 10.5 14.388 10.4937C13.9244 10.4415 13.5585 10.0756 13.5063 9.61196C13.5 9.55616 13.5 9.48982 13.5 9.35714V6.5Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className=" flex justify-center flex-col items-center">
                    <div className="text-lg font-semibold text-gray-500 ">Total</div>
                    <div className="text-3xl font-[900] text-sky-800  ">
                        <CountUp start={0} end={stats.total_count} duration={7} />
                    </div>
                </div>
            </div>
        </div>
    )
}
