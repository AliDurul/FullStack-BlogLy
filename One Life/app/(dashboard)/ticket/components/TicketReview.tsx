'use client'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import Dropdown from '@/app/components/Layout/Dropdown'
import 'react-quill/dist/quill.snow.css';
import { Kyc, Ticket } from '@/types/types';
import { formatDate } from '@/utils/helperFunctions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectIsEscalation, selectTicket, setEscalate, setTicketModal, updateTicketState, updateTickets, updateticketComments } from '@/lib/features/tickets/ticketSlice';
import TicketModal from './TicketModal';
import { fetchAllCategoryAsync } from '@/lib/features/category/categorySlice';
import { createTicketComment, deleteTicket, getTicketComments } from '@/lib/features/tickets/ticketAPI';
import useDeleteToasts from '@/hooks/useDeleteToasts';
import { useRouter } from 'next/navigation';
import { coloredToast } from '@/utils/sweetAlerts';
import UserSideProfile from '@/app/components/UserSideProfile';
import { readKyc } from '@/lib/features/kyc/kycAPI';
import Link from 'next/link';


export default function TicketReview() {
    const ticket = useAppSelector(selectTicket);
    const isEscalation = useAppSelector(selectIsEscalation)
    const [sideProfileModal, setSideProfileModal] = useState(false)
    const [clientInfo, setClientInfo] = useState<Kyc>()

    async function getTicketClientInfo() {
        if (!ticket) return
        const res = await readKyc(typeof ticket.client_phonenumber === 'object' ? ticket?.client_phonenumber?.id ?? null : null)
        if (res) setClientInfo(res)
    }
    useEffect(() => {
        if (ticket) getTicketClientInfo()
    }, [ticket])


    const dispatch = useAppDispatch();
    const router = useRouter()
    const { deleteToast } = useDeleteToasts();

    const statusOp = [
        { name: 'Pending', color: 'fill-primary' },
        { name: 'Active', color: 'fill-warning' },
        { name: 'Resolved', color: 'fill-success ' },
        { name: 'Cancelled', color: 'fill-dark' },
        { name: 'Escalated', color: 'fill-danger' },
    ];

    const flagOp = [
        { name: 'Important', color: 'fill-primary' },
        { name: 'Moderate', color: 'fill-warning' },
        { name: 'Least Important', color: 'fill-dark' },
        { name: 'Prank', color: 'fill-danger' },
    ];

    const priorityOp = [
        { name: 'Medium', color: 'fill-primary' },
        { name: 'Low', color: 'fill-warning' },
        { name: 'Heigh', color: 'fill-danger' },
        { name: 'Critical', color: 'fill-danger' },
    ];

    const [comment, setComment] = useState('');

    const handleDelete = async (id: string) => {
        const deletionSuccess = await deleteToast(id, deleteTicket, updateTickets);
        if (deletionSuccess) {
            router.push('/ticket')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createTicketComment({ body: comment, ticket_id: ticket?.ticket_id })
            if (res.error) throw new Error(res.error)
            const data = await getTicketComments(ticket.ticket_id || '');
            dispatch(updateticketComments(data));
            coloredToast('success', 'Comment added successfully')
            setComment('')
        } catch (error: any) {
            coloredToast('danger', error.message)
        }
    }

    const lightBgColor = ticket?.priority === 'Medium'
        ? 'bg-primary-light shadow-[#b4e2ed]'
        : ticket?.priority === 'Low'
            ? 'bg-warning-light shadow-warning'
            : ticket?.priority === 'High'
                ? 'bg-danger-light shadow-danger'
                : ticket?.priority === 'Critical'
                    ? 'bg-danger-light shadow-primary'
                    : 'dark:shadow-dark'

    const darkBgColor = ticket?.priority === 'Medium'
        ? 'bg-primary-dark-light'
        : ticket?.priority === 'Low'
            ? 'bg-warning-dark-light '
            : ticket?.priority === 'High'
                ? 'bg-danger-dark-light'
                : ticket?.priority === 'Critical'
                    ? 'bg-danger-dark-light'
                    : 'dark:shadow-dark'

    const ticketStatus = ticket?.status === 'Active'
        ? 'badge-outline-success'
        : ticket?.status === 'Pending'
            ? 'badge-outline-warning'
            : ticket?.status === 'Cancelled'
                ? 'badge-outline-dark'
                : ticket?.status === 'Resolved'
                    ? 'badge-outline-success'
                    : ticket?.status === 'Escalated'
                        ? 'badge-outline-danger'
                        : ''

    return (
        <div className={` panel p-0  ${isEscalation ? 'sm:col-span-2' : 'sm:col-span-3'} ${lightBgColor}`}>
            {/* Header */}
            <div className=" mb-1 flex items-start justify-between  p-5 ">
                <h5 className="sm:text-2xl text-sm font-extrabold ">Ticket / <span className='text-sm'>{ticket?.ticket_id ?? ''}</span></h5>
                <div className="flex items-center gap-4">
                    <div className="dropdown">
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, -5]}
                                placement='bottom-start'
                                btnClassName={`${ticket?.priority === 'Medium'
                                    ? 'text-primary'
                                    : ticket?.priority === 'Low'
                                        ? 'text-warning'
                                        : ticket?.priority === 'Heigh'
                                            ? 'text-danger'
                                            : ticket?.priority === 'Critical'
                                                ? 'text-danger'
                                                : ''
                                    } `}
                                button={
                                    <span className={`flex gap-2 items-center badge rounded-xl ${ticket?.priority === 'Medium'
                                        ? 'badge-outline-primary'
                                        : ticket?.priority === 'Low'
                                            ? 'badge-outline-warning'
                                            : ticket?.priority === 'High'
                                                ? 'badge-outline-danger'
                                                : ticket?.priority === 'Critical'
                                                    ? 'badge-outline-danger'
                                                    : 'badge-outline-secondary'
                                        } `}> <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-3 w-3 rotate-45 ${ticket?.priority === 'Medium'
                                                ? 'fill-primary'
                                                : ticket?.priority === 'Low'
                                                    ? 'fill-warning'
                                                    : ticket?.priority === 'High'
                                                        ? 'fill-danger'
                                                        : ticket?.priority === 'Critical'
                                                            ? 'fill-danger'
                                                            : ''
                                                } `}
                                        >
                                            <path
                                                d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            ></path>
                                        </svg>
                                        {ticket?.priority}
                                    </span>
                                }
                            >
                                <ul className="text-sm font-medium">
                                    {
                                        priorityOp.map((op, i) => (
                                            <li key={i}>
                                                <button type="button" className={op.name === ticket?.priority ? 'bg-primary/10 text-primary' : ''}>
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`h-3 w-3 rotate-45 ${op.color} ltr:mr-2 rtl:ml-2`}
                                                    >
                                                        <path
                                                            d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                                            stroke="none"
                                                            strokeWidth="1.5"
                                                        ></path>
                                                    </svg>
                                                    {op.name}
                                                </button>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="dropdown">
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, -5]}
                                placement='bottom-start'
                                button={
                                    <div className={`flex justify-center items-center gap-2 badge rounded-xl  ${ticketStatus} `}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 6.5C2.5 4.29086 4.29086 2.5 6.5 2.5C8.70914 2.5 10.5 4.29086 10.5 6.5V9.16667C10.5 9.47666 10.5 9.63165 10.4659 9.75882C10.3735 10.1039 10.1039 10.3735 9.75882 10.4659C9.63165 10.5 9.47666 10.5 9.16667 10.5H6.5C4.29086 10.5 2.5 8.70914 2.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M13.5 14.8333C13.5 14.5233 13.5 14.3683 13.5341 14.2412C13.6265 13.8961 13.8961 13.6265 14.2412 13.5341C14.3683 13.5 14.5233 13.5 14.8333 13.5H17.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7091 19.7091 21.5 17.5 21.5C15.2909 21.5 13.5 19.7091 13.5 17.5V14.8333Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M2.5 17.5C2.5 15.2909 4.29086 13.5 6.5 13.5H8.9C9.46005 13.5 9.74008 13.5 9.95399 13.609C10.1422 13.7049 10.2951 13.8578 10.391 14.046C10.5 14.2599 10.5 14.5399 10.5 15.1V17.5C10.5 19.7091 8.70914 21.5 6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M13.5 6.5C13.5 4.29086 15.2909 2.5 17.5 2.5C19.7091 2.5 21.5 4.29086 21.5 6.5C21.5 8.70914 19.7091 10.5 17.5 10.5H14.6429C14.5102 10.5 14.4438 10.5 14.388 10.4937C13.9244 10.4415 13.5585 10.0756 13.5063 9.61196C13.5 9.55616 13.5 9.48982 13.5 9.35714V6.5Z" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        {ticket?.status}
                                    </div>
                                }
                            >
                                <ul className="text-sm font-medium">
                                    {
                                        statusOp.map((op, i) => (
                                            <li key={i}>
                                                <button type="button" className={op.name === ticket?.status ? 'bg-primary/10 text-primary' : ''}>
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`h-3 w-3 rotate-45 ${op.color} ltr:mr-2 rtl:ml-2`}
                                                    >
                                                        <path
                                                            d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                                            stroke="none"
                                                            strokeWidth="1.5"
                                                        ></path>
                                                    </svg>
                                                    {op.name}
                                                </button>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="dropdown ">
                        <Dropdown
                            offset={[-10, -5]}
                            placement='bottom-start'
                            button={
                                <div className={`flex justify-center items-center gap-2 badge  rounded-xl badge-outline-secondary`}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.8221 14.2945C18.4082 14.148 18.6861 13.4769 18.3753 12.9589L16.8147 10.3578C16.4732 9.78863 16.3024 9.50405 16.2619 9.19451C16.2451 9.06539 16.2451 8.93461 16.2619 8.80549C16.3024 8.49595 16.4732 8.21137 16.8147 7.64221L18.0932 5.51132C18.4278 4.9536 17.9211 4.26972 17.2901 4.42746C15.8013 4.79967 14.2331 4.69323 12.8082 4.12329L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" />
                                    </svg>
                                    {ticket?.flag}
                                </div>
                            }
                        >
                            <ul className="text-sm font-medium !min-w-[153px]">
                                {
                                    flagOp.map((op, i) => (
                                        <li key={i}>
                                            <button type="button" className={op.name === ticket?.flag ? 'bg-primary/10 text-primary' : ''}>
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`h-3 w-3 rotate-45 ${op.color} ltr:mr-2 rtl:ml-2`}
                                                >
                                                    <path
                                                        d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                                        stroke="none"
                                                        strokeWidth="1.5"
                                                    ></path>
                                                </svg>
                                                {op.name}
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </Dropdown>
                    </div>
                    <div className="dropdown">
                        <Dropdown
                            offset={[0, -5]}
                            placement='bottom-end'
                            btnClassName="text-primary"
                            button={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90 opacity-70">
                                    <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            }
                        >
                            <ul className="text-sm font-medium">
                                <li>
                                    <button type="button" onClick={() => {
                                        dispatch(updateTicketState({ ...ticket, cat: typeof ticket.cat === 'number' ? ticket.cat : ticket.cat?.id })),
                                            dispatch(setTicketModal(true)),
                                            dispatch(fetchAllCategoryAsync({}))
                                    }} >
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 ltr:mr-3 rtl:ml-3"
                                        >
                                            <path
                                                d="M15.2869 3.15178L14.3601 4.07866L5.83882 12.5999L5.83881 12.5999C5.26166 13.1771 4.97308 13.4656 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.32181 19.8021L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L4.19792 21.6782L7.47918 20.5844L7.47919 20.5844C8.25353 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5344 19.0269 10.8229 18.7383 11.4001 18.1612L11.4001 18.1612L19.9213 9.63993L20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M14.36 4.07812C14.36 4.07812 14.4759 6.04774 16.2138 7.78564C17.9517 9.52354 19.9213 9.6394 19.9213 9.6394M4.19789 21.6777L2.32178 19.8015"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                        Edit
                                    </button>
                                </li>

                                <li>
                                    <button type="button" onClick={() => handleDelete(ticket.ticket_id || '')}>
                                        <svg className="ltr:mr-3 rtl:ml-3" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                            <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path
                                                d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                            <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        Delete
                                    </button>
                                </li>
                                {
                                    ticket.status !== "Escalated" && (
                                        <li>
                                            <button type="button" onClick={() => dispatch(setEscalate(true))}>
                                                <svg className="ltr:mr-3 rtl:ml-3" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167C21 10.8996 21 11.4234 21 11.9914C21 17.6294 16.761 20.3655 14.1014 21.5273C13.38 21.8424 13.0193 22 12 22C10.9807 22 10.62 21.8424 9.89856 21.5273C7.23896 20.3655 3 17.6294 3 11.9914C3 11.4234 3 10.8996 3 10.4167Z" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M16 11.55L12.6 9C12.2444 8.73333 11.7556 8.73333 11.4 9L8 11.55M14 14.05L12 12.55L10 14.05" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                Escalate
                                            </button>
                                        </li>
                                    )
                                }
                                {
                                    ticket.email_id && (
                                        <li>
                                            <Link type="button" href={`/mailbox?emailId=${ticket.email_id}`}>
                                               Show Email
                                            </Link>
                                        </li>
                                    )
                                }

                            </ul>
                        </Dropdown>
                    </div>
                </div>
            </div>
            {/* Body */}
            <div className='p-5 pt-0 pb-3 relative' key={ticket.ticket_id}>
                <form action="" onSubmit={handleSubmit}>
                    <div className="">
                        <div className="flex justify-between">
                            <div className="flex w-max items-center">
                                <div className="ltr:ml-2 rtl:mr-2">
                                    <div className="font-bold text-xl ">{ticket?.title}</div>
                                    <div className="text-sx text-white-dark">{formatDate(ticket?.timestamp, true)}</div>
                                </div>
                            </div>
                            <div className='text-center cursor-pointer' onClick={() => setSideProfileModal(true)} >
                                <h2 className='text-lg font-bold'>
                                    {typeof ticket.client_phonenumber !== "number" && `${ticket.client_phonenumber?.first_name ? ticket?.client_phonenumber?.first_name + ' ' + ticket?.client_phonenumber?.last_name : ticket.caller_email}`}
                                </h2>
                                <h2 className='text-base '>
                                    {typeof ticket.client_phonenumber !== "number" && ticket?.client_phonenumber?.phone_number}
                                </h2>
                            </div>
                        </div>
                        {/* Divider */}
                        {/* <div className="mx-auto mt-3 h-px border-b border-white-light dark:border-[#1b2e4b] w-3/4" /> */}
                        <div className="relative mt-3">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-[#eee]" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className=" bg-[#eee] px-2 text-sm text-gray-500">Description</span>
                            </div>
                        </div>
                        <div>
                            <div className="mt-4 text-lg font-semibold" dangerouslySetInnerHTML={{
                                __html: ticket?.description,
                            }}>
                                {/* <span className='text-white-dark'>Description : </span> */}
                                {/* {ticket?.description} */}
                            </div>
                            <p className="mt-10 text-lg text-white-dark">{ticket?.assigned_agent?.first_name} {ticket?.assigned_agent?.last_name}</p>
                        </div>
                        <div className='my-5 '>
                            {/* <ReactQuill theme="snow" comment={comment} onChange={setComment} placeholder='' /> */}
                            <div className="flex">
                                <div className={`${darkBgColor} flex justify-center items-center ltr:rounded-l-md  px-3 font-semibold border ltr:border-r-0  border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] whitespace-nowrap`}>
                                    Enter New Comment
                                </div>
                                <textarea value={comment} rows={2} className="form-textarea ltr:rounded-l-none bg-transparent focus:border-dark-dark-light" onChange={(e) => setComment(e.target.value)}></textarea>
                            </div>

                        </div>
                    </div>
                    <div >
                        <button type="submit" className="btn rounded-xl ml-auto btn-secondary "> Commit</button>
                    </div>
                </form>

            </div>
            <TicketModal />
            <UserSideProfile sideProfileModal={sideProfileModal} setSideProfileModal={setSideProfileModal} clientInfo={clientInfo} />
        </div>
    )
}
