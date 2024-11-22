'use client'
import { escalateTicket, readTicket } from '@/lib/features/tickets/ticketAPI';
import { selectIsEscalation, selectTicket, setEscalate, updateTicketState } from '@/lib/features/tickets/ticketSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Ticket } from '@/types/types';
import { coloredToast } from '@/utils/sweetAlerts';
import React from 'react'
import MaskedInput from 'react-text-mask';

const TicketEscForm = () => {

    const ticket = useAppSelector(selectTicket);

    const isEscalation = useAppSelector(selectIsEscalation)
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const location = form['location'].value as HTMLInputElement;
        const landmark = form['landMark'].value as HTMLInputElement;
        const phone_number = form['phoneNo'].value as HTMLInputElement;
        const reason = form['reason'].value as HTMLInputElement;


        const res = await escalateTicket({ location, landmark, phone_number, reason, ticket: ticket.ticket_id })

        if (res.message) {
            const data = await readTicket(ticket.ticket_id ? ticket.ticket_id : '')
            dispatch(updateTicketState(data))
            coloredToast('success', res.message)
            dispatch(setEscalate(false))
        } else coloredToast('danger', res.Error)

    }

    return (
        // <div className={`panel  flex-shrink w-full h-full  md:w-3/12 ${isEscalation ? 'display' : 'hidden'}`}>
        <div className={`panel pb-2 sm:col-span-1 ${isEscalation ? 'display' : 'hidden'}`}>
            <div className="mb-4 flex items-start justify-between border-b border-white-light py-2 pt-0  dark:border-[#1b2e4b] dark:text-white-light">
                <h5 className="text-lg font-semibold ">Escalation Form</h5>
                <button
                    type="button"
                    onClick={() => { dispatch(setEscalate(false)) }}
                    className="absolute top-5 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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
            </div>
            <form className='space-y-6' onSubmit={handleSubmit}>
                <div className="flex">
                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.5 3H16C15.7239 3 15.5 3.22386 15.5 3.5V3.55891L19 6.35891V3.5C19 3.22386 18.7762 3 18.5 3Z" fill="#1C274C" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z" fill="#1C274C" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M20.75 10.9605L21.5315 11.5857C21.855 11.8444 22.3269 11.792 22.5857 11.4685C22.8444 11.1451 22.792 10.6731 22.4685 10.4143L14.3426 3.91362C12.9731 2.81796 11.027 2.81796 9.65742 3.91362L1.53151 10.4143C1.20806 10.6731 1.15562 11.1451 1.41438 11.4685C1.67313 11.792 2.1451 11.8444 2.46855 11.5857L3.25003 10.9605V21.25H2.00003C1.58581 21.25 1.25003 21.5858 1.25003 22C1.25003 22.4142 1.58581 22.75 2.00003 22.75H22C22.4142 22.75 22.75 22.4142 22.75 22C22.75 21.5858 22.4142 21.25 22 21.25H20.75V10.9605ZM9.25003 9.5C9.25003 7.98122 10.4812 6.75 12 6.75C13.5188 6.75 14.75 7.98122 14.75 9.5C14.75 11.0188 13.5188 12.25 12 12.25C10.4812 12.25 9.25003 11.0188 9.25003 9.5ZM12.0494 13.25C12.7143 13.25 13.2871 13.2499 13.7459 13.3116C14.2375 13.3777 14.7088 13.5268 15.091 13.909C15.4733 14.2913 15.6223 14.7625 15.6884 15.2542C15.7462 15.6842 15.7498 16.2146 15.75 16.827C15.75 16.8679 15.75 16.9091 15.75 16.9506L15.75 21.25H14.25V17C14.25 16.2717 14.2484 15.8009 14.2018 15.454C14.1581 15.1287 14.0875 15.0268 14.0304 14.9697C13.9733 14.9126 13.8713 14.842 13.546 14.7982C13.1991 14.7516 12.7283 14.75 12 14.75C11.2717 14.75 10.8009 14.7516 10.4541 14.7982C10.1288 14.842 10.0268 14.9126 9.9697 14.9697C9.9126 15.0268 9.84199 15.1287 9.79826 15.454C9.75162 15.8009 9.75003 16.2717 9.75003 17V21.25H8.25003L8.25003 16.9506C8.24999 16.2858 8.24996 15.7129 8.31163 15.2542C8.37773 14.7625 8.52679 14.2913 8.90904 13.909C9.29128 13.5268 9.76255 13.3777 10.2542 13.3116C10.7129 13.2499 11.2858 13.25 11.9507 13.25H12.0494Z" fill="#1C274C" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z" fill="#1C274C" />
                        </svg>
                    </div>
                    <input id="location" type="text" placeholder="Enter Location" className="form-input ltr:rounded-l-none rtl:rounded-r-none" required />
                </div>
                <div className="flex">
                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.5 8.5C21.5 7.09554 21.5 6.39331 21.1629 5.88886C21.017 5.67048 20.8295 5.48298 20.6111 5.33706C20.1699 5.04224 19.5774 5.00529 18.496 5.00066C18.5001 5.29206 18.5 5.59655 18.5 5.91051L18.5 6V7.25H19.5C19.9142 7.25 20.25 7.58579 20.25 8C20.25 8.41421 19.9142 8.75 19.5 8.75H18.5V10.25H19.5C19.9142 10.25 20.25 10.5858 20.25 11C20.25 11.4142 19.9142 11.75 19.5 11.75H18.5V13.25H19.5C19.9142 13.25 20.25 13.5858 20.25 14C20.25 14.4142 19.9142 14.75 19.5 14.75H18.5V21.25H17V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V21.25H5.5V14.75H4.5C4.08579 14.75 3.75 14.4142 3.75 14C3.75 13.5858 4.08579 13.25 4.5 13.25H5.5V11.75H4.5C4.08579 11.75 3.75 11.4142 3.75 11C3.75 10.5858 4.08579 10.25 4.5 10.25H5.5V8.75H4.5C4.08579 8.75 3.75 8.41421 3.75 8C3.75 7.58579 4.08579 7.25 4.5 7.25H5.5V6L5.49999 5.9105C5.49996 5.59655 5.49992 5.29206 5.50403 5.00066C4.42262 5.00529 3.83008 5.04224 3.38886 5.33706C3.17048 5.48298 2.98298 5.67048 2.83706 5.88886C2.5 6.39331 2.5 7.09554 2.5 8.5V21.25H2C1.58579 21.25 1.25 21.5858 1.25 22C1.25 22.4142 1.58579 22.75 2 22.75H22C22.4142 22.75 22.75 22.4142 22.75 22C22.75 21.5858 22.4142 21.25 22 21.25H21.5V8.5ZM12 4.25C12.4142 4.25 12.75 4.58579 12.75 5V6.25H14C14.4142 6.25 14.75 6.58579 14.75 7C14.75 7.41421 14.4142 7.75 14 7.75H12.75V9C12.75 9.41421 12.4142 9.75 12 9.75C11.5858 9.75 11.25 9.41421 11.25 9V7.75H10C9.58579 7.75 9.25 7.41421 9.25 7C9.25 6.58579 9.58579 6.25 10 6.25H11.25V5C11.25 4.58579 11.5858 4.25 12 4.25ZM9.25 12C9.25 11.5858 9.58579 11.25 10 11.25H14C14.4142 11.25 14.75 11.5858 14.75 12C14.75 12.4142 14.4142 12.75 14 12.75H10C9.58579 12.75 9.25 12.4142 9.25 12ZM9.25 15C9.25 14.5858 9.58579 14.25 10 14.25H14C14.4142 14.25 14.75 14.5858 14.75 15C14.75 15.4142 14.4142 15.75 14 15.75H10C9.58579 15.75 9.25 15.4142 9.25 15ZM12 18.25C12.4142 18.25 12.75 18.5858 12.75 19V21.25H11.25V19C11.25 18.5858 11.5858 18.25 12 18.25Z" fill="#1C274C" />
                        </svg>

                    </div>
                    <input id="landMark" type="text" placeholder="Enter Land Mark" className="form-input ltr:rounded-l-none rtl:rounded-r-none " required />
                </div>
            
                <div className='flex'>
                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5562 15.5477L14.1007 16.0272C14.1007 16.0272 13.0181 17.167 10.0631 14.0559C7.10812 10.9448 8.1907 9.80507 8.1907 9.80507L8.47752 9.50311C9.18407 8.75924 9.25068 7.56497 8.63424 6.6931L7.37326 4.90961C6.61028 3.8305 5.13596 3.68795 4.26145 4.60864L2.69185 6.26114C2.25823 6.71766 1.96765 7.30945 2.00289 7.96594C2.09304 9.64546 2.81071 13.259 6.81536 17.4752C11.0621 21.9462 15.0468 22.1239 16.6763 21.9631C17.1917 21.9122 17.6399 21.6343 18.0011 21.254L19.4217 19.7584C20.3806 18.7489 20.1102 17.0182 18.8833 16.312L16.9728 15.2123C16.1672 14.7486 15.1858 14.8848 14.5562 15.5477Z" fill="#1C274C" />
                            <path d="M17 12C19.7614 12 22 9.76142 22 7C22 4.23858 19.7614 2 17 2C14.2386 2 12 4.23858 12 7C12 7.79984 12.1878 8.55582 12.5217 9.22624C12.6105 9.4044 12.64 9.60803 12.5886 9.80031L12.2908 10.9133C12.1615 11.3965 12.6035 11.8385 13.0867 11.7092L14.1997 11.4114C14.392 11.36 14.5956 11.3895 14.7738 11.4783C15.4442 11.8122 16.2002 12 17 12Z" fill="#1C274C" />
                        </svg>
                    </div>
                    <MaskedInput
                        id="phoneNo"
                        name='client_phone_number'
                        type="text"
                        placeholder="+___-___-___-___"
                        className="form-input "
                        required
                        mask={[
                            '+',
                            /\d/, /\d/, /\d/, // Allow up to three digits for the country code
                            '-',
                            /\d/, /\d/, /\d/, // First group of three digits
                            '-',
                            /\d/, /\d/, /\d/, // Second group of three digits
                            '-',
                            /\d/, /\d/, /\d/  // Third group of three digits
                        ]}
                    />
                </div>
                <div>
                    {/* <label htmlFor="phoneNo">Reason:</label> */}
                    <textarea rows={4} className="form-textarea resize-none" placeholder="Reason..." id="reason" required />
                </div>
                <button type="submit" className="btn btn-secondary ml-auto !mt-6">
                    Escalate
                </button>
            </form>
        </div>
    )
}

export default TicketEscForm