import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Disclosure } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllEmailsAsync, openMail, selectFolders, selectIsEdit, selectIsShowMailMenu, selectSelectedTab, setFolderId, setIsEdit, setIsShowMailMenu, setSelectedTab, setStar, updateEmailState } from '@/lib/features/email/emailSlice';
import { useRouter } from 'next/navigation';



const MailSubMenu = () => {
    const dispatch = useAppDispatch();
    const router = useRouter()
    const isShowMailMenu = useAppSelector(selectIsShowMailMenu);
    const selectedTab = useAppSelector(selectSelectedTab);
    const folders = useAppSelector(selectFolders);
    const isEdit = useAppSelector(selectIsEdit);


    function getItemCount(folderName: string) {

        const folder = folders.find(d => d.displayName === folderName);
        if (folderName === 'Inbox') {
            return folder ? folder.unreadItemCount : 0;
        }
        return folder ? folder.totalItemCount : 0;
    }

    async function setTabFunc(folderName: string) {
        dispatch(setSelectedTab(folderName));
        dispatch(setIsEdit(false))
        dispatch(setIsShowMailMenu(false))
        dispatch(updateEmailState(null))
        const SelectedFolderId = folders.find(d => d.displayName === folderName)?.id;
        if (SelectedFolderId) dispatch(setFolderId(SelectedFolderId))

        dispatch(fetchAllEmailsAsync(SelectedFolderId))
    }

    return (
        <div
            className={`panel dark:gray-50 absolute z-10 hidden h-full w-[250px] max-w-full flex-none space-y-3 overflow-hidden p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md ${isShowMailMenu ? '!block' : ''
                }`}
        >
            <div className="flex h-full flex-col pb-16">
                <div className="pb-5">
                    <button className="btn btn-primary w-full" type="button" onClick={() => { dispatch(openMail({ type: 'add', item: null })); router.push('/mailbox/action') }}>
                        New Message
                    </button>
                </div>
                <PerfectScrollbar className="relative -mr-3.5 h-full grow pr-3.5">
                    <div className="space-y-1">
                        <button
                            type="button"
                            className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'Inbox' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                }`}
                            onClick={() => { setTabFunc('Inbox') }}
                        >
                            <div className="flex items-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        opacity="0.5"
                                        d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="ltr:ml-3 rtl:mr-3">Inbox</div>
                            </div>
                            <div className="whitespace-nowrap rounded-md bg-primary-light py-0.5 px-2 font-semibold dark:bg-[#060818]">
                                {getItemCount("Inbox")}
                            </div>
                        </button>

                        {/*  <button
                    type="button"
                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'star' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                        }`}
                    onClick={() => {
                        setSelectedTab('star');
                        tabChanged('star');
                    }}
                >
                    <div className="flex items-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>
                        <div className="ltr:ml-3 rtl:mr-3">Marked</div>
                    </div>
                </button> */}

                        <button
                            type="button"
                            className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'Sent Items' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                }`}
                            onClick={() => { setTabFunc('Sent Items') }}
                        >
                            <div className="flex items-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M17.4975 18.4851L20.6281 9.09373C21.8764 5.34874 22.5006 3.47624 21.5122 2.48782C20.5237 1.49939 18.6511 2.12356 14.906 3.37189L5.57477 6.48218C3.49295 7.1761 2.45203 7.52305 2.13608 8.28637C2.06182 8.46577 2.01692 8.65596 2.00311 8.84963C1.94433 9.67365 2.72018 10.4495 4.27188 12.0011L4.55451 12.2837C4.80921 12.5384 4.93655 12.6658 5.03282 12.8075C5.22269 13.0871 5.33046 13.4143 5.34393 13.7519C5.35076 13.9232 5.32403 14.1013 5.27057 14.4574C5.07488 15.7612 4.97703 16.4131 5.0923 16.9147C5.32205 17.9146 6.09599 18.6995 7.09257 18.9433C7.59255 19.0656 8.24576 18.977 9.5522 18.7997L9.62363 18.79C9.99191 18.74 10.1761 18.715 10.3529 18.7257C10.6738 18.745 10.9838 18.8496 11.251 19.0285C11.3981 19.1271 11.5295 19.2585 11.7923 19.5213L12.0436 19.7725C13.5539 21.2828 14.309 22.0379 15.1101 21.9985C15.3309 21.9877 15.5479 21.9365 15.7503 21.8474C16.4844 21.5244 16.8221 20.5113 17.4975 18.4851Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path opacity="0.5" d="M6 18L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>

                                <div className="ltr:ml-3 rtl:mr-3">Sent</div>
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'Archive' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                }`}
                            onClick={() => { setTabFunc('Archive') }}
                        >
                            <div className="flex items-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9 12C9 11.5341 9 11.3011 9.07612 11.1173C9.17761 10.8723 9.37229 10.6776 9.61732 10.5761C9.80109 10.5 10.0341 10.5 10.5 10.5H13.5C13.9659 10.5 14.1989 10.5 14.3827 10.5761C14.6277 10.6776 14.8224 10.8723 14.9239 11.1173C15 11.3011 15 11.5341 15 12C15 12.4659 15 12.6989 14.9239 12.8827C14.8224 13.1277 14.6277 13.3224 14.3827 13.4239C14.1989 13.5 13.9659 13.5 13.5 13.5H10.5C10.0341 13.5 9.80109 13.5 9.61732 13.4239C9.37229 13.3224 9.17761 13.1277 9.07612 12.8827C9 12.6989 9 12.4659 9 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        opacity="0.5"
                                        d="M20.5 7V13C20.5 16.7712 20.5 18.6569 19.3284 19.8284C18.1569 21 16.2712 21 12.5 21H11.5C7.72876 21 5.84315 21 4.67157 19.8284C3.5 18.6569 3.5 16.7712 3.5 13V7"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M2 5C2 4.05719 2 3.58579 2.29289 3.29289C2.58579 3 3.05719 3 4 3H20C20.9428 3 21.4142 3 21.7071 3.29289C22 3.58579 22 4.05719 22 5C22 5.94281 22 6.41421 21.7071 6.70711C21.4142 7 20.9428 7 20 7H4C3.05719 7 2.58579 7 2.29289 6.70711C2 6.41421 2 5.94281 2 5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                                <div className="ltr:ml-3 rtl:mr-3">Archive</div>
                            </div>
                            <div className="whitespace-nowrap rounded-md bg-primary-light py-0.5 px-2 font-semibold dark:bg-[#060818]">
                                {getItemCount("Archive")}
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'Drafts' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                }`}
                            onClick={() => { setTabFunc('Drafts') }}
                        >
                            <div className="flex items-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                                        fill="currentColor"
                                    />
                                    <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                <div className="ltr:ml-3 rtl:mr-3">Drafts</div>
                            </div>
                            <div className="whitespace-nowrap rounded-md bg-primary-light py-0.5 px-2 font-semibold dark:bg-[#060818]">
                                {getItemCount("Drafts")}
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'Deleted Items' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                }`}
                            onClick={() => { setTabFunc('Deleted Items') }}
                        >
                            <div className="flex items-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                <div className="ltr:ml-3 rtl:mr-3">Trash</div>
                            </div>
                            <div className="whitespace-nowrap rounded-md bg-primary-light py-0.5 px-2 font-semibold dark:bg-[#060818]">
                                {getItemCount("Deleted Items")}

                            </div>
                        </button>

                        <Disclosure as="div">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`rotate-90 ${open ? '-rotate-90' : ''}`}>
                                            <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                        <div className="ltr:ml-3 rtl:mr-3">{open ? 'Less' : 'More'}</div>
                                    </Disclosure.Button>

                                    <Disclosure.Panel as="ul" unmount={false} className="mt-1 space-y-1">
                                        <li>
                                            <button
                                                type="button"
                                                className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'spam' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                                    }`}
                                            // onClick={() => { setTabFunc('Deleted Items') }}

                                            >
                                                <div className="flex items-center">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                                                        <path
                                                            opacity="0.5"
                                                            d="M7.84308 3.80211C9.8718 2.6007 10.8862 2 12 2C13.1138 2 14.1282 2.6007 16.1569 3.80211L16.8431 4.20846C18.8718 5.40987 19.8862 6.01057 20.4431 7C21 7.98943 21 9.19084 21 11.5937V12.4063C21 14.8092 21 16.0106 20.4431 17C19.8862 17.9894 18.8718 18.5901 16.8431 19.7915L16.1569 20.1979C14.1282 21.3993 13.1138 22 12 22C10.8862 22 9.8718 21.3993 7.84308 20.1979L7.15692 19.7915C5.1282 18.5901 4.11384 17.9894 3.55692 17C3 16.0106 3 14.8092 3 12.4063V11.5937C3 9.19084 3 7.98943 3.55692 7C4.11384 6.01057 5.1282 5.40987 7.15692 4.20846L7.84308 3.80211Z"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                        />
                                                    </svg>
                                                    <div className="ltr:ml-3 rtl:mr-3">Spam</div>
                                                </div>
                                            </button>
                                        </li>
                                        {/*  <li>
                                    <button
                                        type="button"
                                        className={`flex h-10 w-full items-center rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${!isEdit && selectedTab === 'high' ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                            }`}
                                        onClick={() => {
                                            setSelectedTab('high');
                                            tabChanged('high');
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M21 16.0909V11.0975C21 6.80891 21 4.6646 19.682 3.3323C18.364 2 16.2426 2 12 2C7.75736 2 5.63604 2 4.31802 3.3323C3 4.6646 3 6.80891 3 11.0975V16.0909C3 19.1875 3 20.7358 3.73411 21.4123C4.08421 21.735 4.52615 21.9377 4.99692 21.9915C5.98402 22.1045 7.13673 21.0849 9.44216 19.0458C10.4612 18.1445 10.9708 17.6938 11.5603 17.5751C11.8506 17.5166 12.1494 17.5166 12.4397 17.5751C13.0292 17.6938 13.5388 18.1445 14.5578 19.0458C16.8633 21.0849 18.016 22.1045 19.0031 21.9915C19.4739 21.9377 19.9158 21.735 20.2659 21.4123C21 20.7358 21 19.1875 21 16.0909Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path opacity="0.5" d="M15 6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <div className="ltr:ml-3 rtl:mr-3">Important</div>
                                    </button>
                                </li> */}
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>

                        <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>

                        {/* NEW MEETING / JOIN MEETING BUTTONS */}
                        {/* <button
                    type="button"
                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary`}
                >
                    <div className="flex items-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                opacity="0.5"
                                d="M17 9.50019L17.6584 9.17101C19.6042 8.19807 20.5772 7.7116 21.2886 8.15127C22 8.59094 22 9.67872 22 11.8543V12.1461C22 14.3217 22 15.4094 21.2886 15.8491C20.5772 16.2888 19.6042 15.8023 17.6584 14.8294L17 14.5002V9.50019Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                opacity="0.5"
                                d="M13.5607 7.43934C14.1464 8.02513 14.1464 8.97487 13.5607 9.56066C12.9749 10.1464 12.0251 10.1464 11.4393 9.56066C10.8536 8.97487 10.8536 8.02513 11.4393 7.43934C12.0251 6.85355 12.9749 6.85355 13.5607 7.43934Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M2 11.5C2 8.21252 2 6.56878 2.90796 5.46243C3.07418 5.25989 3.25989 5.07418 3.46243 4.90796C4.56878 4 6.21252 4 9.5 4C12.7875 4 14.4312 4 15.5376 4.90796C15.7401 5.07418 15.9258 5.25989 16.092 5.46243C17 6.56878 17 8.21252 17 11.5V12.5C17 15.7875 17 17.4312 16.092 18.5376C15.9258 18.7401 15.7401 18.9258 15.5376 19.092C14.4312 20 12.7875 20 9.5 20C6.21252 20 4.56878 20 3.46243 19.092C3.25989 18.9258 3.07418 18.7401 2.90796 18.5376C2 17.4312 2 15.7875 2 12.5V11.5Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>
                        <div className="ltr:ml-3 rtl:mr-3">New meeting</div>
                    </div>
                </button>
                <button
                    type="button"
                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary`}
                >
                    <div className="flex items-center">
                        <svg className="rotate-180" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                opacity="0.5"
                                d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path d="M7 18L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M12 18V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M17 18V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <div className="ltr:ml-3 rtl:mr-3">Join a meeting</div>
                    </div>
                </button>
                <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div> */}
                    </div>
                </PerfectScrollbar>

                {/* ADD ACCOUNT */}
                {/*    <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
            <button
                type="button"
                className="group flex w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary"
                onClick={() => setIsShowMailMenu(false)}
            >
                <div className="flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path
                            opacity="0.5"
                            d="M18 17.5C18 19.9853 18 22 10 22C2 22 2 19.9853 2 17.5C2 15.0147 5.58172 13 10 13C14.4183 13 18 15.0147 18 17.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div className="ltr:ml-3 rtl:mr-3">Add Account</div>
                </div>
                <div className="rounded-md bg-primary-light py-1 px-2 dark:bg-[#060818]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </div>
            </button>
        </div> */}
            </div>
        </div>
    )
}

export default MailSubMenu