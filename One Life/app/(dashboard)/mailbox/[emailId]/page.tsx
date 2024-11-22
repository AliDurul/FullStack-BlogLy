'use client'
import React, { useEffect } from 'react'
import { MailPrintIcon, MailZipIcon } from '../components/MailIcons';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEmailByIdAsync, openMail, selectEmailStatus, selectIsEdit, selectMail, selectSelectedTab, setImportant, setStar, updateEmailState } from '@/lib/features/email/emailSlice';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';
import Dropdown from '@/app/components/Layout/Dropdown';
import { ToRecipient } from '@/types/types';
import { formatDate } from '@/utils/helperFunctions';
import { SingleMail } from '../components/MailSkeletons';



const MailDetailPage = ({ params }: { params: { emailId: string } }) => {

    const { emailId } = params

    const router = useRouter()
    const dispatch = useAppDispatch()
    const selectedMail = useAppSelector(selectMail);
    const selectedTab = useAppSelector(selectSelectedTab);
    // const isEdit = useAppSelector(selectIsEdit);
    const emailStatus = useAppSelector(selectEmailStatus)

    useEffect(() => {

        dispatch(fetchEmailByIdAsync(emailId))

    }, []);



    return (
        <>
            {
                (emailStatus === 'idle' || selectedMail) ? (
                    <div>
                        <div className="flex flex-wrap items-center justify-between p-4">
                            <div className="flex items-center">
                                <button type="button" className="hover:text-primary ltr:mr-2 rtl:ml-2" onClick={() => {
                                    // setSelectedMail(null),
                                    dispatch(updateEmailState(null)),
                                        router.back()
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 rtl:rotate-180">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                </button>
                                <h4 className="text-base font-medium ltr:mr-2 rtl:ml-2 md:text-lg">{selectedMail?.subject}</h4>
                                <div className={`badge hover:top-0 ${(selectedMail?.importance === 'normal' && 'bg-primary') ||
                                    (selectedMail?.importance === 'low' && 'bg-warning') ||
                                    (selectedMail?.importance === 'social' && 'bg-success') ||
                                    (selectedMail?.importance === 'high' && 'bg-danger')
                                    }`}>{selectedMail?.importance}</div>
                            </div>
                            <div>
                                <Tippy content="Print">
                                    <button type="button">
                                        <MailPrintIcon />
                                    </button>
                                </Tippy>
                            </div>
                        </div>
                        <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                        <div className="relative p-4">
                            <div className="flex flex-wrap">
                                <div className="flex-shrink-0 ltr:mr-2 rtl:ml-2">
                                    {selectedMail?.path ? (
                                        <img src={`/assets/images/${selectedMail?.path}`} className="h-12 w-12 rounded-full object-cover" alt="avatar" />
                                    ) : (
                                        <div className="rounded-full border border-gray-300 p-3 dark:border-gray-800">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 ltr:mr-2 rtl:ml-2">
                                    <div className="flex items-center">
                                        <div className="whitespace-nowrap text-lg ltr:mr-4 rtl:ml-4">
                                            {selectedMail?.from.emailAddress.name ? selectedMail?.from.emailAddress.name : selectedMail?.from.emailAddress.address}
                                        </div>
                                        {selectedMail?.group && (
                                            <div className="ltr:mr-4 rtl:ml-4">
                                                <Tippy content={selectedMail?.group} className="capitalize">
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${(selectedMail?.group === 'personal' && 'bg-primary') ||
                                                            (selectedMail?.group === 'work' && 'bg-warning') ||
                                                            (selectedMail?.group === 'social' && 'bg-success') ||
                                                            (selectedMail?.group === 'private' && 'bg-danger')
                                                            }`}
                                                    ></div>
                                                </Tippy>
                                            </div>
                                        )}
                                        {/* <div className="whitespace-nowrap text-white-dark">{formatDistanceToNow(new Date(selectedMail?.receivedDateTime), { addSuffix: true })}</div> */}
                                    </div>
                                    <div className="flex items-center text-white-dark">
                                        <div className="ltr:mr-1 rtl:ml-1">{selectedMail?.type === 'Sent Items' ? selectedMail?.email : 'to me'}</div>
                                        <div className="dropdown">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement={'bottom-start'}
                                                btnClassName="hover:text-primary flex items-center"
                                                button={
                                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                }
                                            >
                                                <ul className="sm:w-64">
                                                    <li>
                                                        <div className="flex items-center px-4 py-2">
                                                            <div className="w-1/4 text-white-dark ltr:mr-2 rtl:ml-2">From:</div>
                                                            <div className="flex-1">{selectedMail?.type === 'Sent Items' ? 'alidrl26@gmail.com' : selectedMail?.from.emailAddress.address}</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex items-center px-4 py-2 flex-wrap">
                                                            <div className="w-1/4 text-white-dark ltr:mr-2 rtl:ml-2">To:</div>
                                                            {
                                                                selectedMail?.toRecipients.map((m: ToRecipient) => (<div className="flex-1 p-1 cursor-pointer hover:font-bold hover:text-black">{m.emailAddress.address}</div>))
                                                            }

                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex items-center px-4 py-2">
                                                            <div className="w-1/4 text-white-dark ltr:mr-2 rtl:ml-2">Date:</div>
                                                            <div className="flex-1">{formatDate(selectedMail?.receivedDateTime)}</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="flex items-center px-4 py-2">
                                                            <div className="w-1/4 text-white-dark ltr:mr-2 rtl:ml-2">Subject:</div>
                                                            <div className="flex-1">{selectedMail?.subject}</div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                                        <Tippy content="Star">
                                            <button
                                                type="button"
                                                className={`enabled:hover:text-warning disabled:opacity-60 ${selectedMail?.isStar ? 'text-warning' : ''}`}
                                                onClick={() => dispatch(setStar({ mail: selectedMail?.id }))}
                                                disabled={selectedTab === 'Deleted Items'}
                                            >
                                                <svg
                                                    className={selectedMail?.isStar ? 'fill-warning' : ''}
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            </button>
                                        </Tippy>
                                        <Tippy content="Important">
                                            <button
                                                type="button"
                                                className={`enabled:hover:text-primary disabled:opacity-60 ${selectedMail?.isImportant ? 'text-primary' : ''}`}
                                                onClick={() => dispatch(setImportant({ mail: selectedMail?.id }))}

                                                disabled={selectedTab === 'Deleted Items'}
                                            >
                                                <svg
                                                    className={`rotate-90 ${selectedMail?.isImportant ? 'fill-primary' : ''}`}
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M21 16.0909V11.0975C21 6.80891 21 4.6646 19.682 3.3323C18.364 2 16.2426 2 12 2C7.75736 2 5.63604 2 4.31802 3.3323C3 4.6646 3 6.80891 3 11.0975V16.0909C3 19.1875 3 20.7358 3.73411 21.4123C4.08421 21.735 4.52615 21.9377 4.99692 21.9915C5.98402 22.1045 7.13673 21.0849 9.44216 19.0458C10.4612 18.1445 10.9708 17.6938 11.5603 17.5751C11.8506 17.5166 12.1494 17.5166 12.4397 17.5751C13.0292 17.6938 13.5388 18.1445 14.5578 19.0458C16.8633 21.0849 18.016 22.1045 19.0031 21.9915C19.4739 21.9377 19.9158 21.735 20.2659 21.4123C21 20.7358 21 19.1875 21 16.0909Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            </button>
                                        </Tippy>
                                        <Tippy content="Reply">
                                            <button type="button" className="hover:text-info" onClick={() => { dispatch(openMail({ type: 'reply', item: selectedMail })); router.push('/mailbox/action') }}>

                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:hidden">
                                                    <path d="M9.5 7L4.5 12L9.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path opacity="0.5" d="M4.5 12L14.5 12C16.1667 12 19.5 13 19.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:hidden rtl:block">
                                                    <path d="M14.5 7L19.5 12L14.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path opacity="0.5" d="M19.5 12L9.5 12C7.83333 12 4.5 13 4.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </Tippy>
                                        <Tippy content="Forward">
                                            <button type="button" className="hover:text-info" onClick={() => { dispatch(openMail({ type: 'forward', item: selectedMail })); router.push('/mailbox/action') }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:hidden rtl:block">
                                                    <path d="M9.5 7L4.5 12L9.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path opacity="0.5" d="M4.5 12L14.5 12C16.1667 12 19.5 13 19.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:hidden">
                                                    <path d="M14.5 7L19.5 12L14.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path opacity="0.5" d="M19.5 12L9.5 12C7.83333 12 4.5 13 4.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </Tippy>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="prose mt-8 max-w-full prose-p:text-sm prose-img:m-0 prose-img:inline-block dark:prose-p:text-white md:prose-p:text-sm"
                                dangerouslySetInnerHTML={{ __html: selectedMail?.body.content }}
                            ></div>

                            {selectedMail?.attachments && (
                                <div className="mt-8">
                                    <div className="mb-4 text-base">Attachments</div>
                                    <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                                    <div className="mt-6 flex flex-wrap items-center">
                                        {selectedMail?.attachments.map((attachment: any, i: number) => {
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className="group relative mb-4 flex items-center rounded-md border border-white-light px-4 py-2.5 transition-all duration-300 hover:border-primary hover:text-primary ltr:mr-4 rtl:ml-4 dark:border-[#1b2e4b]"
                                                >
                                                    {attachment.type === 'image' && (
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                            />
                                                            <circle opacity="0.5" cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                            <path
                                                                opacity="0.5"
                                                                d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    )}
                                                    {attachment.type === 'folder' && (
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                            <path opacity="0.5" d="M18 10L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path
                                                                d="M2 6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C18.8345 6 20.1506 6 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V6.94975Z"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                            />
                                                        </svg>
                                                    )}
                                                    {attachment.type === 'zip' && (
                                                        <MailZipIcon />
                                                    )}
                                                    {attachment.type !== 'zip' && attachment.type !== 'image' && attachment.type !== 'folder' && (
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                            <path
                                                                d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                                                                fill="currentColor"
                                                            />
                                                            <path opacity="0.5" d="M6 14.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path opacity="0.5" d="M6 18H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path
                                                                opacity="0.5"
                                                                d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                            />
                                                        </svg>
                                                    )}

                                                    <div className="ltr:ml-3 rtl:mr-3">
                                                        <p className="text-xs font-semibold text-primary">{attachment.name}</p>
                                                        <p className="text-[11px] text-gray-400 dark:text-gray-600">{attachment.size}</p>
                                                    </div>
                                                    <div className="absolute top-0 z-[5] hidden h-full w-full rounded-md bg-dark-light/40 group-hover:block ltr:left-0 rtl:right-0"></div>
                                                    <div className="btn btn-primary absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full p-1 group-hover:block">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                            <path
                                                                opacity="0.5"
                                                                d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (<SingleMail />)
            }
        </>
    )
}

export default MailDetailPage