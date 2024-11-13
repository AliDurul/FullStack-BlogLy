import React, { useEffect } from 'react'
import ReactQuill from 'react-quill';
import { formatDate } from '@/utils/helperFunctions';
import Tippy from '@tippyjs/react';
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllEmailsAsync, fetchAllEmailsFolderAsync, fetchEmailByIdAsync, openMail, selectEmailStatus, selectFolderId, selectFolders, selectIds, selectIsEdit, selectIsShowMailMenu, selectMail, selectPagedMails, selectSelectedTab, setIds, setImportant, setIsEdit, setIsShowMailMenu, setSelectedTab, setStar, updateEmailState } from '@/lib/features/email/emailSlice';
import { deleteEmail, forwardMessage, getAllEmailsForFolder, replyMessage, sendMessage, updateEmailProperties } from '../../../../lib/features/email/mailAPI';
import Dropdown from '@/app/components/Layout/Dropdown';
import { MailReadIcon, MailRefreshIcon, MailTrashIcon, MailUnReadIcon, MailZipIcon } from './MailIcons';

interface MailRightBoxProps {
    pager: any;
    setMailList: (value: any) => void;
    searchText: string;
    filteredMailList: any;
    searchMails: (value?: boolean) => void;
    clearSelection: () => void;
    setSearchText: (value: string) => void;
    children: React.ReactNode;
}

const MailRightBox = ({ pager, setMailList, searchText, filteredMailList, searchMails, clearSelection, setSearchText, children }: MailRightBoxProps) => {

    const dispatch = useAppDispatch();
    const isShowMailMenu = useAppSelector(selectIsShowMailMenu);
    const selectedTab = useAppSelector(selectSelectedTab);
    const selectedMail = useAppSelector(selectMail);
    const folderId = useAppSelector(selectFolderId);
    const ids = useAppSelector(selectIds);
    const folders = useAppSelector(selectFolders);
    const emailStatus = useAppSelector(selectEmailStatus);
    const isEdit = useAppSelector(selectIsEdit);




    const setAction = async (type: any) => {
        if (ids.length) {
            const totalSelected = ids.length;
            let items = filteredMailList.filter((d: any) => ids.includes(d.id));
            const flagStatus = null
            const importance = null
            for (let item of items) {
                if (type === 'Deleted Items') {

                    ids.map(async (id: any) => {
                        const res = await deleteEmail(id)
                        if (res.isDeleted) {
                            searchMails(false);
                        } else {
                            showMessage(res.error);
                        }
                    })

                    showMessage(totalSelected + ' Mail has been deleted.');
                    dispatch(fetchAllEmailsAsync(folderId))
                    dispatch(fetchAllEmailsFolderAsync({}))

                } else if (type === 'read') {
                    ids.map(async (id: any) => {
                        const res = await updateEmailProperties({ emailId: id, isRead: true, flagStatus, importance })
                        if (res?.error) {
                            showMessage(res.error);
                        }
                    })
                    dispatch(fetchAllEmailsAsync(folderId))
                    dispatch(fetchAllEmailsFolderAsync({}))
                    showMessage(totalSelected + ' Mail has been marked as Read.');
                } else if (type === 'unread') {
                    ids.map(async (id: any) => {
                        const res = await updateEmailProperties({ emailId: id, isRead: false, flagStatus, importance })
                        if (res?.error) {
                            showMessage(res.error);
                        }
                    })
                    dispatch(fetchAllEmailsAsync(folderId))
                    dispatch(fetchAllEmailsFolderAsync({}))
                    showMessage(totalSelected + ' Mail has been marked as UnRead.');
                } else if (type === 'high') {
                    item.isImportant = true;
                    showMessage(totalSelected + ' Mail has been marked as Important.');
                } else if (type === 'unimportant') {
                    item.isImportant = false;
                    showMessage(totalSelected + ' Mail has been marked as UnImportant.');
                } else if (type === 'star') {
                    item.isStar = true;
                    showMessage(totalSelected + ' Mail has been marked as Star.');
                }
                //restore & permanent delete
                else if (type === 'restore') {
                    item.type = 'Inbox';
                    showMessage(totalSelected + ' Mail Restored.');
                    searchMails(false);
                } else if (type === 'delete') {
                    // setNewMailList(mailList.filter((d: any) => d.id != item.id));
                    showMessage(totalSelected + ' Mail Permanently Deleted.');
                    searchMails(false);
                }
            }
            clearSelection();
        }
    };


    const refreshMails = async () => {
        setSearchText('');
        searchMails(false);
        dispatch(fetchAllEmailsAsync(folderId))
    };

    const setArchive = () => {
        if (ids.length) {
            let items = filteredMailList.filter((d: any) => ids.includes(d.id));
            for (let item of items) {
                item.type = item.type === 'Archive' ? 'Inbox' : 'Archive';
            }
            if (selectedTab === 'Archive') {
                showMessage(ids.length + ' Mail has been removed from Archive.');
            } else {
                showMessage(ids.length + ' Mail has been added to Archive.');
            }
            searchMails(false);
        }
    };

    const setSpam = () => {
        if (ids.length) {
            let items = filteredMailList.filter((d: any) => ids.includes(d.id));
            for (let item of items) {
                item.type = item.type === 'spam' ? 'Inbox' : 'spam';
            }
            if (selectedTab === 'spam') {
                showMessage(ids.length + ' Mail has been removed from Spam.');
            } else {
                showMessage(ids.length + ' Mail has been added to Spam.');
            }
            searchMails(false);
        }
    };

    /*  const getFileSize = (file_type: any) => {
         let type = 'file';
         if (file_type.includes('image/')) {
             type = 'image';
         } else if (file_type.includes('application/x-zip')) {
             type = 'zip';
         }
         return type;
     };
 
     const getFileType = (total_bytes: number) => {
         let size = '';
         if (total_bytes < 1000000) {
             size = Math.floor(total_bytes / 1000) + 'KB';
         } else {
             size = Math.floor(total_bytes / 1000000) + 'MB';
         }
         return size;
     }; */

    const checkAllCheckbox = () => {
        if (filteredMailList?.length && ids.length === filteredMailList?.length) {
            return true;
        } else {
            return false;
        }
    };



    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };



    return (
        <div className="panel h-full flex-1 overflow-x-hidden p-0">
            {/* TOP ICON */}
            {
                !selectedMail && !isEdit && (
                    <div className="flex flex-col">
                        <div className="flex flex-wrap-reverse items-center justify-between gap-4 p-4">
                            <div className="flex w-full items-center sm:w-auto">
                                <div className="ltr:mr-4 rtl:ml-4">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        checked={checkAllCheckbox()}
                                        value={ids}
                                        onChange={() => {
                                            if (ids.length === filteredMailList.length) {
                                                dispatch(setIds([]));
                                                // setIds([]);
                                            } else {
                                                let checkedIds = filteredMailList.map((d: any) => {
                                                    return d.id;
                                                });
                                                dispatch(setIds([...checkedIds]));
                                                // setIds([...checkedIds]);
                                            }
                                        }}
                                        onClick={(event) => event.stopPropagation()}
                                    />
                                </div>

                                <div className="ltr:mr-4 rtl:ml-4">
                                    {
                                        emailStatus === 'idle' ? (
                                            <Tippy content="Refresh">

                                                <button type="button" className="flex items-center hover:text-primary" onClick={() => refreshMails()}>
                                                    <MailRefreshIcon />

                                                </button>
                                            </Tippy>

                                        ) : (<span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-6 h-6 inline-block align-middle m-auto"></span>)
                                    }

                                </div>

                                {selectedTab !== 'Deleted Items' && (
                                    <ul className="flex grow items-center gap-4 sm:flex-none ltr:sm:mr-4 rtl:sm:ml-4">
                                        <li>
                                            <div>
                                                <Tippy content="Archive">
                                                    <button type="button" className="flex items-center hover:text-primary" onClick={setArchive}>
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
                                                    </button>
                                                </Tippy>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <Tippy content="Spam">
                                                    <button type="button" className="flex items-center hover:text-primary" onClick={setSpam}>
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
                                                    </button>
                                                </Tippy>
                                            </div>
                                        </li>
                                        {/* GROUP EMAILS */}
                                        {/*   <li>
                                        <div className="dropdown">
                                            <Dropdown
                                                offset={[0, 1]}
                                                placement={'bottom-start'}
                                                btnClassName="hover:text-primary flex items-center"
                                                button={
                                                    <Tippy content="Group">
                                                        <span>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                                <path opacity="0.5" d="M15 9L19 5" stroke="currentColor" strokeWidth="1.5" />
                                                                <path opacity="0.5" d="M5 19L9 15" stroke="currentColor" strokeWidth="1.5" />
                                                                <path opacity="0.5" d="M9 9L5 5" stroke="currentColor" strokeWidth="1.5" />
                                                                <path opacity="0.5" d="M19 19L15 15" stroke="currentColor" strokeWidth="1.5" />
                                                            </svg>
                                                        </span>
                                                    </Tippy>
                                                }
                                            >
                                                <ul className="text-sm font-medium">
                                                    <li>
                                                        <button type="button" className="w-full" onClick={() => setGroup('personal')}>
                                                            <div className="h-2 w-2 rounded-full bg-primary ltr:mr-3 rtl:ml-3"></div>
                                                            Personal
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="w-full" onClick={() => setGroup('work')}>
                                                            <div className="h-2 w-2 rounded-full bg-warning ltr:mr-3 rtl:ml-3"></div>
                                                            Work
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="w-full" onClick={() => setGroup('social')}>
                                                            <div className="h-2 w-2 rounded-full bg-success ltr:mr-3 rtl:ml-3"></div>
                                                            Social
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="w-full" onClick={() => setGroup('private')}>
                                                            <div className="h-2 w-2 rounded-full bg-danger ltr:mr-3 rtl:ml-3"></div>
                                                            Private
                                                        </button>
                                                    </li>
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </li> */}
                                        <li>
                                            <div className="dropdown">
                                                <Dropdown
                                                    offset={[0, 1]}
                                                    placement={'bottom-start'}
                                                    btnClassName="hover:text-primary flex items-center"
                                                    button={
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90 opacity-70">
                                                            <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                        </svg>
                                                    }
                                                >
                                                    <ul className="whitespace-nowrap">
                                                        <li>
                                                            <button type="button" className="w-full" onClick={() => setAction('read')}>
                                                                <MailReadIcon />
                                                                Mark as Read
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" className="w-full" onClick={() => setAction('unread')}>
                                                                <MailUnReadIcon />
                                                                Mark as Unread
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" className="w-full" onClick={() => setAction('Deleted Items')}>
                                                                <MailTrashIcon />
                                                                Trash
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </Dropdown>
                                            </div>
                                        </li>
                                    </ul>
                                )}

                                {selectedTab === 'Deleted Items' && (
                                    <ul className="flex flex-1 items-center gap-4 sm:flex-none ltr:sm:mr-3 rtl:sm:ml-4">
                                        <li>
                                            <div>
                                                <Tippy content="Permanently Delete">
                                                    <button type="button" className="block hover:text-primary" onClick={() => setAction('delete')}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path
                                                                d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                            />
                                                            <path
                                                                opacity="0.5"
                                                                d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                            />
                                                        </svg>
                                                    </button>
                                                </Tippy>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <Tippy content="Restore">
                                                    <button type="button" className="block hover:text-primary" onClick={() => setAction('restore')}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g clipPath="url(#clip0_1276_6232)">
                                                                <path
                                                                    d="M19.7285 10.9288C20.4413 13.5978 19.7507 16.5635 17.6569 18.6573C14.5327 21.7815 9.46736 21.7815 6.34316 18.6573C3.21897 15.5331 3.21897 10.4678 6.34316 7.3436C9.46736 4.21941 14.5327 4.21941 17.6569 7.3436L18.364 8.05071M18.364 8.05071H14.1213M18.364 8.05071V3.80807"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_1276_6232">
                                                                    <rect width="24" height="24" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </button>
                                                </Tippy>
                                            </div>
                                        </li>
                                    </ul>
                                )}
                            </div>

                            <div className="flex w-full items-center justify-between sm:w-auto">
                                <div className="flex items-center ltr:mr-4 rtl:ml-4">
                                    <button type="button" className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden" onClick={() => dispatch(setIsShowMailMenu(!isShowMailMenu))}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                    <div className="group relative">
                                        <input
                                            type="text"
                                            className="peer form-input ltr:pr-8 rtl:pl-8"
                                            placeholder="Search Mail"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            onKeyUp={() => searchMails()}
                                        />
                                        <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                                                <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {/* <div className="ltr:mr-4 rtl:ml-4">
                                    <Tippy content="Settings">
                                        <button type="button" className="hover:text-primary">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"></circle>
                                                <path
                                                    opacity="0.5"
                                                    d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                ></path>
                                            </svg>
                                        </button>
                                    </Tippy>
                                </div> */}
                                    <div>
                                        <Tippy content="Help">
                                            <button type="button" className="hover:text-primary">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                    <path
                                                        d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                    />
                                                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                                                </svg>
                                            </button>
                                        </Tippy>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                        {/* BUTTONS */}
                        <div className="flex flex-col flex-wrap items-center justify-between px-4 pb-4 md:flex-row xl:w-auto">
                            <div className="mt-4 grid w-full grid-cols-2 gap-3 sm:w-auto sm:grid-cols-5">
                                <button
                                    type="button"
                                    className={`btn btn-outline-info flex ${selectedTab === 'All' ? 'bg-info text-white' : ''}`}
                                    onClick={() => {
                                        dispatch(setSelectedTab("All"));
                                    }}
                                >
                                    Show All
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-outline-primary flex ${selectedTab === 'normal' ? 'bg-primary text-white' : ''}`}
                                    onClick={() => {
                                        dispatch(setSelectedTab("normal"));
                                    }}
                                >
                                    <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                        <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                    Normal
                                </button>

                                <button
                                    type="button"
                                    className={`btn btn-outline-warning flex ${selectedTab === 'low' ? 'bg-warning text-white' : ''}`}
                                    onClick={() => {
                                        dispatch(setSelectedTab("low"));
                                    }}
                                >
                                    <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M13.0867 21.3877L13.7321 21.7697L13.0867 21.3877ZM13.6288 20.4718L12.9833 20.0898L13.6288 20.4718ZM10.3712 20.4718L9.72579 20.8539H9.72579L10.3712 20.4718ZM10.9133 21.3877L11.5587 21.0057L10.9133 21.3877ZM2.3806 15.9134L3.07351 15.6264V15.6264L2.3806 15.9134ZM7.78958 18.9915L7.77666 19.7413L7.78958 18.9915ZM5.08658 18.6194L4.79957 19.3123H4.79957L5.08658 18.6194ZM21.6194 15.9134L22.3123 16.2004V16.2004L21.6194 15.9134ZM16.2104 18.9915L16.1975 18.2416L16.2104 18.9915ZM18.9134 18.6194L19.2004 19.3123H19.2004L18.9134 18.6194ZM19.6125 2.7368L19.2206 3.37628L19.6125 2.7368ZM21.2632 4.38751L21.9027 3.99563V3.99563L21.2632 4.38751ZM4.38751 2.7368L3.99563 2.09732V2.09732L4.38751 2.7368ZM2.7368 4.38751L2.09732 3.99563H2.09732L2.7368 4.38751ZM9.40279 19.2098L9.77986 18.5615L9.77986 18.5615L9.40279 19.2098ZM13.7321 21.7697L14.2742 20.8539L12.9833 20.0898L12.4412 21.0057L13.7321 21.7697ZM9.72579 20.8539L10.2679 21.7697L11.5587 21.0057L11.0166 20.0898L9.72579 20.8539ZM12.4412 21.0057C12.2485 21.3313 11.7515 21.3313 11.5587 21.0057L10.2679 21.7697C11.0415 23.0767 12.9585 23.0767 13.7321 21.7697L12.4412 21.0057ZM10.5 2.75H13.5V1.25H10.5V2.75ZM21.25 10.5V11.5H22.75V10.5H21.25ZM2.75 11.5V10.5H1.25V11.5H2.75ZM1.25 11.5C1.25 12.6546 1.24959 13.5581 1.29931 14.2868C1.3495 15.0223 1.45323 15.6344 1.68769 16.2004L3.07351 15.6264C2.92737 15.2736 2.84081 14.8438 2.79584 14.1847C2.75041 13.5189 2.75 12.6751 2.75 11.5H1.25ZM7.8025 18.2416C6.54706 18.2199 5.88923 18.1401 5.37359 17.9265L4.79957 19.3123C5.60454 19.6457 6.52138 19.7197 7.77666 19.7413L7.8025 18.2416ZM1.68769 16.2004C2.27128 17.6093 3.39066 18.7287 4.79957 19.3123L5.3736 17.9265C4.33223 17.4951 3.50486 16.6678 3.07351 15.6264L1.68769 16.2004ZM21.25 11.5C21.25 12.6751 21.2496 13.5189 21.2042 14.1847C21.1592 14.8438 21.0726 15.2736 20.9265 15.6264L22.3123 16.2004C22.5468 15.6344 22.6505 15.0223 22.7007 14.2868C22.7504 13.5581 22.75 12.6546 22.75 11.5H21.25ZM16.2233 19.7413C17.4786 19.7197 18.3955 19.6457 19.2004 19.3123L18.6264 17.9265C18.1108 18.1401 17.4529 18.2199 16.1975 18.2416L16.2233 19.7413ZM20.9265 15.6264C20.4951 16.6678 19.6678 17.4951 18.6264 17.9265L19.2004 19.3123C20.6093 18.7287 21.7287 17.6093 22.3123 16.2004L20.9265 15.6264ZM13.5 2.75C15.1512 2.75 16.337 2.75079 17.2619 2.83873C18.1757 2.92561 18.7571 3.09223 19.2206 3.37628L20.0044 2.09732C19.2655 1.64457 18.4274 1.44279 17.4039 1.34547C16.3915 1.24921 15.1222 1.25 13.5 1.25V2.75ZM22.75 10.5C22.75 8.87781 22.7508 7.6085 22.6545 6.59611C22.5572 5.57256 22.3554 4.73445 21.9027 3.99563L20.6237 4.77938C20.9078 5.24291 21.0744 5.82434 21.1613 6.73809C21.2492 7.663 21.25 8.84876 21.25 10.5H22.75ZM19.2206 3.37628C19.7925 3.72672 20.2733 4.20752 20.6237 4.77938L21.9027 3.99563C21.4286 3.22194 20.7781 2.57144 20.0044 2.09732L19.2206 3.37628ZM10.5 1.25C8.87781 1.25 7.6085 1.24921 6.59611 1.34547C5.57256 1.44279 4.73445 1.64457 3.99563 2.09732L4.77938 3.37628C5.24291 3.09223 5.82434 2.92561 6.73809 2.83873C7.663 2.75079 8.84876 2.75 10.5 2.75V1.25ZM2.75 10.5C2.75 8.84876 2.75079 7.663 2.83873 6.73809C2.92561 5.82434 3.09223 5.24291 3.37628 4.77938L2.09732 3.99563C1.64457 4.73445 1.44279 5.57256 1.34547 6.59611C1.24921 7.6085 1.25 8.87781 1.25 10.5H2.75ZM3.99563 2.09732C3.22194 2.57144 2.57144 3.22194 2.09732 3.99563L3.37628 4.77938C3.72672 4.20752 4.20752 3.72672 4.77938 3.37628L3.99563 2.09732ZM11.0166 20.0898C10.8136 19.7468 10.6354 19.4441 10.4621 19.2063C10.2795 18.9559 10.0702 18.7304 9.77986 18.5615L9.02572 19.8582C9.07313 19.8857 9.13772 19.936 9.24985 20.0898C9.37122 20.2564 9.50835 20.4865 9.72579 20.8539L11.0166 20.0898ZM7.77666 19.7413C8.21575 19.7489 8.49387 19.7545 8.70588 19.7779C8.90399 19.7999 8.98078 19.832 9.02572 19.8582L9.77986 18.5615C9.4871 18.3912 9.18246 18.3215 8.87097 18.287C8.57339 18.2541 8.21375 18.2487 7.8025 18.2416L7.77666 19.7413ZM14.2742 20.8539C14.4916 20.4865 14.6287 20.2564 14.7501 20.0898C14.8622 19.936 14.9268 19.8857 14.9742 19.8582L14.2201 18.5615C13.9298 18.7304 13.7204 18.9559 13.5379 19.2063C13.3646 19.4441 13.1864 19.7468 12.9833 20.0898L14.2742 20.8539ZM16.1975 18.2416C15.7862 18.2487 15.4266 18.2541 15.129 18.287C14.8175 18.3215 14.5129 18.3912 14.2201 18.5615L14.9742 19.8582C15.0192 19.832 15.096 19.7999 15.2941 19.7779C15.5061 19.7545 15.7842 19.7489 16.2233 19.7413L16.1975 18.2416Z"
                                            fill="currentColor"
                                        />
                                        <path opacity="0.5" d="M12 15V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M8 13V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M16 13V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    Low
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-outline-danger flex ${selectedTab === 'high' ? 'bg-danger text-white' : ''}`}
                                    onClick={() => {
                                        dispatch(setSelectedTab("high"));
                                    }}
                                >
                                    <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4.72848 16.1369C3.18295 14.5914 2.41018 13.8186 2.12264 12.816C1.83509 11.8134 2.08083 10.7485 2.57231 8.61875L2.85574 7.39057C3.26922 5.59881 3.47597 4.70292 4.08944 4.08944C4.70292 3.47597 5.59881 3.26922 7.39057 2.85574L8.61875 2.57231C10.7485 2.08083 11.8134 1.83509 12.816 2.12264C13.8186 2.41018 14.5914 3.18295 16.1369 4.72848L17.9665 6.55812C20.6555 9.24711 22 10.5916 22 12.2623C22 13.933 20.6555 15.2775 17.9665 17.9665C15.2775 20.6555 13.933 22 12.2623 22C10.5916 22 9.24711 20.6555 6.55812 17.9665L4.72848 16.1369Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <circle opacity="0.5" cx="8.60699" cy="8.87891" r="2" transform="rotate(-45 8.60699 8.87891)" stroke="currentColor" strokeWidth="1.5" />
                                        <path opacity="0.5" d="M11.5417 18.5L18.5208 11.5208" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    Important
                                </button>
                                <div className="dropdown">
                                    <Dropdown
                                        offset={[0, 1]}
                                        placement={'bottom-start'}
                                        btnClassName="hover:text-primary flex items-center"
                                        button={
                                            <button
                                                type="button"
                                                className={`btn btn-outline-success flex ${selectedTab === 'social' ? 'bg-success text-white' : ''}`}
                                            >
                                                <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="9" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                    <path
                                                        opacity="0.5"
                                                        d="M12.5 4.3411C13.0375 3.53275 13.9565 3 15 3C16.6569 3 18 4.34315 18 6C18 7.65685 16.6569 9 15 9C13.9565 9 13.0375 8.46725 12.5 7.6589"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <ellipse cx="9" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                                    <path
                                                        opacity="0.5"
                                                        d="M18 14C19.7542 14.3847 21 15.3589 21 16.5C21 17.5293 19.9863 18.4229 18.5 18.8704"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                Group By
                                            </button>
                                        }
                                    >
                                        <ul className="whitespace-nowrap">
                                            <li>
                                                <button type="button" className="w-full" onClick={async () => {
                                                    const res = await getAllEmailsForFolder(folderId, true)
                                                    if (res.error) {
                                                        showMessage(res.error, 'error')
                                                    } else {
                                                        setMailList(res)
                                                    }

                                                }}>

                                                    <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path opacity="0.5" d="M22 10C22.0185 10.7271 22 11.0542 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H13" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" />
                                                        <path d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" />
                                                        <circle cx="19" cy="5" r="3" stroke="#1C274C" strokeWidth="1.5" />
                                                    </svg>

                                                    Unread
                                                </button>
                                            </li>
                                            <li>
                                                <button type="button" className="w-full" onClick={async () => {
                                                    const res = await getAllEmailsForFolder(folderId, false, true)
                                                    if (res.error) {
                                                        showMessage(res.error, 'error')
                                                    } else {
                                                        setMailList(res)
                                                    }
                                                }}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2 ">
                                                        <path d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.8221 14.2945C18.4082 14.148 18.6861 13.4769 18.3753 12.9589L16.8147 10.3578C16.4732 9.78863 16.3024 9.50405 16.2619 9.19451C16.2451 9.06539 16.2451 8.93461 16.2619 8.80549C16.3024 8.49595 16.4732 8.21137 16.8147 7.64221L18.0932 5.51132C18.4278 4.9536 17.9211 4.26972 17.2901 4.42746C15.8013 4.79967 14.2331 4.69323 12.8082 4.12329L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" />
                                                    </svg>

                                                    Flagged
                                                </button>
                                            </li>
                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="mt-4 flex-1 md:flex-auto">
                                <div className="flex items-center justify-center md:justify-end">
                                    <div className="ltr:mr-3 rtl:ml-3">{pager.startIndex + 1 + '-' + (pager.endIndex + 1) + ' of ' + filteredMailList?.length}</div>
                                    <button
                                        type="button"
                                        disabled={pager.currentPage === 1}
                                        className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 ltr:mr-3 rtl:ml-3 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                                        onClick={() => {
                                            pager.currentPage--;
                                            searchMails(false);
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:rotate-180">
                                            <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        disabled={pager.currentPage === pager.totalPages}
                                        className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                                        onClick={() => {
                                            const folderId = folders.find((d: any) => d.displayName === selectedTab)?.id;
                                            const skip = pager.currentPage * pager.pageSize;
                                            // dispatch(fetchAllEmailsAsync(folderId));

                                            pager.currentPage++;
                                            searchMails(false);
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rtl:rotate-180">
                                            <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>

                    </div>)
            }
            {/* CHILDEREN */}
            {/* DISPLAY MESSAGES */}
            {children}

            {/* SEND EMAIL */}
            {/* {
                isEdit && (
                    <div className="relative">
                        <div className="flex items-center py-4 px-6">
                            <button type="button" className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden" onClick={() => dispatch(setIsShowMailMenu(!isShowMailMenu))}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Message</h4>
                        </div>
                        <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>
                        <form className="grid gap-6 p-6">
                            <div>
                                <label htmlFor="to" className='text-gray-600'>To:</label>
                                <input
                                    id="to"
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter To"
                                    defaultValue={params.to}
                                    onChange={(e) => {
                                        changeValue(e);
                                    }}
                                />
                            </div>

                            <div>
                                <input id="cc" type="text" className="form-input" placeholder="Enter Cc" defaultValue={params.cc} onChange={(e) => changeValue(e)} />
                            </div>

                            <div >
                                <label htmlFor="title" className='text-gray-600'>Subject:</label>
                                <input id="title" type="text" className="form-input" placeholder="Enter Subject" defaultValue={params.title} onChange={(e) => changeValue(e)} />
                            </div>

                            <div className="">
                                <ReactQuill
                                    theme="snow"
                                    value={params.comment}
                                    // defaultValue={params.comment || '' }
                                    onChange={(content, delta, source, editor) => {
                                        const updatedComment = editor.getHTML();
                                        setParams({ ...params, comment: updatedComment });
                                    }}

                                    style={{ minHeight: '200px' }}
                                />
                            </div>

                            <div>
                                <input
                                    type="file"
                                    className="form-input p-0 file:border-0 file:bg-primary/90 file:py-2 file:px-4 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5 rtl:file:ml-5"
                                    multiple
                                    accept="image/*,.zip,.pdf,.xls,.xlsx,.txt.doc,.docx"
                                    required
                                />
                            </div>
                            <div className="mt-8 flex items-center ltr:ml-auto rtl:mr-auto">
                                <button type="button" className="btn btn-outline-danger ltr:mr-3 rtl:ml-3" onClick={closeMsgPopUp}>
                                    Close
                                </button>
                                <button type="button" className="btn btn-success ltr:mr-3 rtl:ml-3" onClick={() => saveMail('save', null)}>
                                    Save
                                </button>
                                {
                                    params.id && (<button type="button" className="btn btn-success ltr:mr-3 rtl:ml-3" onClick={() => saveMail('forward', null)}>
                                        Forward
                                    </button>)
                                }
                                <button type="button" className="btn btn-primary" onClick={() => saveMail(params.id ? "reply" : "send", params.id)}>
                                    {params.id ? "Reply" : "Send"}
                                </button>
                            </div>
                        </form>
                    </div>
                )
            } */}
        </div >
    )
}

export default MailRightBox


