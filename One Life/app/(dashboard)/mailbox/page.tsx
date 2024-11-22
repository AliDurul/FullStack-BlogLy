'use client'
import React, { useEffect, useState } from 'react'
import MailboxModal from './components/MailboxModal'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchAllEmailsAsync, fetchAllEmailsFolderAsync, openMail, selectDefaultParams, selectEmailStatus, selectFolderId, selectIds, selectPagedMails, selectSelectedTab, setAssignModal, setIds, setImportant, setStar, updateEmailState } from '@/lib/features/email/emailSlice'
import { updateEmailProperties } from '../../../lib/features/email/mailAPI'
import { useRouter } from 'next/navigation'
import { Email } from '@/types/types'
import Tippy from '@tippyjs/react';
import { MailAssignIcon, MailCompleteIcon } from './components/MailIcons'
import { MailBoxSkeleton } from './components/MailSkeletons'
import { fetchAllKycAsync } from '@/lib/features/kyc/kycSlice'


const MailBoxPage = () => {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const folderId = useAppSelector(selectFolderId);
  const selectedTab = useAppSelector(selectSelectedTab);
  const defaultParams = useAppSelector(selectDefaultParams)
  const pagedMails = useAppSelector(selectPagedMails);
  const emailStatus = useAppSelector(selectEmailStatus);

  useEffect(() => {
    dispatch(fetchAllEmailsAsync(folderId));
    dispatch(fetchAllEmailsFolderAsync({}));
    dispatch(fetchAllKycAsync({ type: 'Agent' }));
  }, [selectedTab]);

  const ids = useAppSelector(selectIds)
  const [ticketMailInfo, setTicketMailInfo] = useState<Email | null>(null)


  const handleModal = async (e: React.MouseEvent<HTMLDivElement>, mail: Email) => {
    e.stopPropagation();
    dispatch(setAssignModal(true))
    // const res = await getEmailById(mail.id);
    setTicketMailInfo(mail)
  }

  const showTime = (item: any) => {
    const displayDt = new Date(item.sentDateTime);
    const cDt = new Date();

    // Check if the given date is today
    if (displayDt.toDateString() === cDt.toDateString()) {
      return `${String(displayDt.getHours()).padStart(2, '0')}:${String(displayDt.getMinutes()).padStart(2, '0')}`;
    } else {
      // If the date is from the same year, show day and month
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      if (displayDt.getFullYear() === cDt.getFullYear()) {
        return `${monthNames[displayDt.getMonth()]} ${String(displayDt.getDate()).padStart(2, '0')}`;
      } else {
        // If the date is from a different year, show the date in DD/MM/YYYY format
        return `${String(displayDt.getDate()).padStart(2, '0')} ${monthNames[displayDt.getMonth()]} ${displayDt.getFullYear()}`;
      }
    }
  };

  const handleCheckboxChange = (id: any) => {
    if (ids.includes(id)) {
      // dispatch(setIds((value) => value.filter((d: any) => d !== id)));
      // setIds((value: any) => value.filter((d: any) => d !== id));
    } else {
      dispatch(setIds([...ids, id]));
      // setIds([...ids, id]);
    }
  };


  const selectMail = async (mail: any) => {
    if (mail) {
      if (!mail.isDraft) {
        router.push(`/mailbox/${mail.id}`, { scroll: false });
        await updateEmailProperties({ emailId: mail.id, isRead: true })
        // setSelectedMail(mail);
      } else {
        dispatch(openMail({ type: 'Drafts', item: mail }));
      }
      // dispatch(fetchAllEmailsAsync(folderId)),
      // dispatch(fetchAllEmailsFolderAsync({}))
    } else {
      // setSelectedMail('');
      dispatch(updateEmailState(null))
    }
  };




  return (
    <>
      {pagedMails?.length ? (
        <div className="table-responsive min-h-[400px] grow overflow-y-auto sm:min-h-[300px]">
          <MailboxModal
            ticketMailInfo={ticketMailInfo}
          />
          <table className="table-hover ">
            <tbody>
              {pagedMails?.map((mail: any) => {
                const { from, subject, bodyPreview, importance, hasAttachments, receivedDateTime, flag } = mail;
                const e1 = mail?.sender?.emailAddress
                const e2 = mail?.toRecipients[0]?.emailAddress

                return (

                  <tr key={mail.id}
                    className={`cursor-pointer relative group transition ${emailStatus === 'loading' ? 'pointer-events-none opacity-50' : ''}`}
                    onClick={async () => { selectMail(mail) }}>
                    <td>
                      <div className="flex items-center whitespace-nowrap">
                        <div className="ltr:mr-3 rtl:ml-3">
                          {ids.includes(mail.id)}
                          <input
                            type="checkbox"
                            id={`chk-${mail.id}`}
                            value={mail.id}
                            checked={ids.length ? ids.includes(mail.id) : false}
                            onChange={() => handleCheckboxChange(mail.id)}
                            onClick={(event) => event.stopPropagation()}
                            className="form-checkbox"
                          />
                        </div>
                        {
                          flag?.flagStatus === 'notFlagged' || flag?.flagStatus === 'flagged' ?
                            <div className="ltr:mr-3 rtl:ml-3">
                              <Tippy content="Flag">
                                <button
                                  type="button"
                                  className={`flex items-center enabled:hover:text-warning disabled:opacity-60 ${flag?.flagStatus === 'flagged' ? 'text-warning' : ''}`}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    dispatch(setStar({ mail }))
                                  }}
                                  disabled={selectedTab === 'Deleted Items'}
                                >
                                  <svg
                                    className={flag?.flagStatus === 'flagged' ? 'fill-warning' : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.8221 14.2945C18.4082 14.148 18.6861 13.4769 18.3753 12.9589L16.8147 10.3578C16.4732 9.78863 16.3024 9.50405 16.2619 9.19451C16.2451 9.06539 16.2451 8.93461 16.2619 8.80549C16.3024 8.49595 16.4732 8.21137 16.8147 7.64221L18.0932 5.51132C18.4278 4.9536 17.9211 4.26972 17.2901 4.42746C15.8013 4.79967 14.2331 4.69323 12.8082 4.12329L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" />
                                  </svg>

                                </button>
                              </Tippy>
                            </div>
                            : <div className="ltr:mr-3 rtl:ml-3">
                              <Tippy content="Completed">
                                <button
                                  type="button"
                                  className={`flex items-center enabled:text-success disabled:opacity-60`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(setStar({ mail }))

                                  }}
                                  disabled={selectedTab === 'Deleted Items'}
                                >
                                  <MailCompleteIcon />
                                </button>
                              </Tippy>
                            </div>
                        }
                        <div className="ltr:mr-3 rtl:ml-3">
                          <Tippy content="Important">
                            <button
                              type="button"
                              className={`flex items-center enabled:hover:text-primary disabled:opacity-60 ${mail.importance === 'high' ? 'text-primary' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(setImportant({ mail: mail }))
                                // setImportant(mail);
                              }}
                              disabled={selectedTab === 'Deleted Items'}
                            >
                              <svg
                                className={`rotate-90 ${mail.importance === 'high' ? 'fill-primary' : ''}`}
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
                        </div>
                        <div className={`whitespace-nowrap font-semibold dark:text-gray-300 ${mail.isRead ? 'text-gray-500 dark:text-gray-500' : ''}`}>
                          {e1?.address !== defaultParams.from ? e1?.name : e2?.name}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="min-w-[300px] overflow-hidden font-medium text-white-dark line-clamp-1">
                        <span className={`${!mail.isRead ? 'font-semibold text-gray-800 dark:text-gray-300' : ''}`}>
                          <span>{subject}</span> &minus;
                          <span> {bodyPreview}</span>
                        </span>
                      </div>
                    </td>
                    <td className='group '>
                      <div className="flex items-center justify-center gap-3">
                        {/* <div
                          className={`h-2 w-2 rounded-full ${(importance === 'normal' && 'bg-primary') ||
                            (importance === 'low' && 'bg-warning') ||
                            // (importance === 'social' && 'bg-success') ||
                            (importance === 'private' && 'bg-danger')
                            }`}
                        /> */}
                        {hasAttachments && (
                          <div className="">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M7.9175 17.8068L15.8084 10.2535C16.7558 9.34668 16.7558 7.87637 15.8084 6.96951M3 10.0346L9.40419 3.90441C12.0569 1.3652 16.3578 1.3652 19.0105 3.90441"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                opacity="0.5"
                                d="M19.0105 13.0996L19.5291 13.6414L19.0105 13.0996ZM11.0624 20.7076L10.5438 20.1658L11.0624 20.7076ZM4.54388 14.4679L5.0625 15.0097L4.54388 14.4679ZM12.3776 6.9694L11.859 6.4276L12.3776 6.9694ZM19.5291 3.3625C19.2299 3.07608 18.7551 3.08646 18.4687 3.38568C18.1823 3.68491 18.1927 4.15967 18.4919 4.44609L19.5291 3.3625ZM18.4919 12.5578L10.5438 20.1658L11.581 21.2494L19.5291 13.6414L18.4919 12.5578ZM5.0625 15.0097L12.8962 7.51119L11.859 6.4276L4.02527 13.9262L5.0625 15.0097ZM16.327 6.4276C15.0896 5.24313 13.0964 5.24313 11.859 6.4276L12.8962 7.51119C13.5536 6.88194 14.6324 6.88194 15.2898 7.51119L16.327 6.4276ZM5.0625 20.1658C3.57096 18.7381 3.57096 16.4375 5.0625 15.0097L4.02527 13.9262C1.91671 15.9445 1.91671 19.2311 4.02527 21.2494L5.0625 20.1658ZM10.5438 20.1658C9.03379 21.6112 6.57253 21.6112 5.0625 20.1658L4.02527 21.2494C6.11533 23.25 9.49098 23.25 11.581 21.2494L10.5438 20.1658ZM18.4919 4.44609C20.8361 6.68999 20.8361 10.3139 18.4919 12.5578L19.5291 13.6414C22.4903 10.8069 22.4903 6.19703 19.5291 3.3625L18.4919 4.44609Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        )}
                        <div onClick={(e) => handleModal(e, mail)} className='absolute right-0 opacity-0 group-hover:right-20 group-hover:opacity-100 transition-all duration-300'>
                          <Tippy content='Assign it' >

                            <MailAssignIcon />

                          </Tippy>

                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap font-medium ltr:text-right rtl:text-left">{showTime(mail)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          {emailStatus === 'loading'
            ? (
              /*   <span className="animate-[spin_3s_linear_infinite] border-8 border-r-warning border-l-primary border-t-danger border-b-success rounded-full w-14 h-14 inline-block align-middle m-auto mb-10"></span> */
              // <span className="animate-spin border-4 border-transparent border-l-primary rounded-full w-12 h-12 inline-block align-middle m-auto mb-10"></span>
              <MailBoxSkeleton />
            )
            : 'No emails found'}
        </div>
      )}
    </>
  )
}

export default MailBoxPage
