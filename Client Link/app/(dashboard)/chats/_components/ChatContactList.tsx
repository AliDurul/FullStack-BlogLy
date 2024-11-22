'use client'
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { postMessage } from '@/lib/features/chat/chatActions';
import { fetchAllChatsAsync, updateChatsState } from '@/lib/features/chat/chatSlice';
import { selectKycs, selectKycState, selectKycStatus } from '@/lib/features/kyc/kycSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Chat, Kyc } from '@/types/types';
import { coloredToast } from '@/utils/sweetAlerts';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar';

interface ChatListProps {
    selectUser: (user: any) => void;
    setSelectedTab: (user: any) => void;

}

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;


const ChatContactList = ({ selectUser, setSelectedTab }: ChatListProps) => {
    const dispatch = useAppDispatch()
    const navigate = useRouter()
    const users = useAppSelector(selectKycs)
    const status = useAppSelector(selectKycStatus)
    const { userInfo } = useCurrentUser()


    useEffect(() => {
        setfilteredItems(users.results)
    }, [users])

    const [searchQuery, setSearchQuery] = useState('')
    const [filteredItems, setfilteredItems] = useState(users.results)


    useEffect(() => {
        setfilteredItems(() => {
            return users.results.filter((user: Kyc) => {
                const searchTerm = searchQuery.toLowerCase()
                return user.first_name.toLowerCase().includes(searchTerm) || user.last_name.toLowerCase().includes(searchTerm)
            })
        })

    }, [searchQuery, users])

    async function handleSelectUser(user: Kyc) {

        if (user.id) {
            const res = await postMessage(null, { receiver: user?.id })
            if (!res.error) {
                navigate.push(`/chats/${res.chat.id}`)
                dispatch(updateChatsState(res.chat))
                // setSelectedTab('Chats')

            }
            else coloredToast('danger', res.error)
        }
    }


    return (
        <div className='relative'>

            {
                status === 'loading' ? (<div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 dark:text-gray-500">Loading...</p>
                </div>) : (
                    <PerfectScrollbar className="user-users relative -mr-3.5 h-full min-h-[100px] space-y-0.5 pb-5 pr-3.5 sm:h-[calc(100vh_-_357px)]">
                        <div className="relative mb-3">
                            <input type="text" className="peer form-input ltr:pr-9 rtl:pl-9" placeholder="Searching..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-2 rtl:left-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                                    <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                </svg>
                            </div>
                        </div>
                        {filteredItems.map((user: Kyc, i: number) => {
                            if (user.id === userInfo?.user_id) return null
                            return (
                                <button
                                    key={user.id}
                                    className="flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-100 hover:text-primary dark:hover:bg-[#050b14] dark:hover:text-primary "
                                    type="button"
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-shrink-0">
                                            <Image
                                                alt='userProfile'
                                                width={48} height={48}
                                                className="rounded-full object-cover"
                                                src={`${BASE_URL}/image/${user?.banks || '/assets/images/profile.png'}`} />
                                        </div>
                                        <div className="mx-3 ltr:text-left rtl:text-right">
                                            <p className="mb-1 font-semibold">{user?.first_name} {user?.last_name}</p>

                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </PerfectScrollbar >
                )
            }
            {
                !filteredItems.length && (

                    <p className="absolute top-1/2 left-24 text-gray-400 dark:text-gray-500">No user found</p>
                )
            }
        </div>

    )
}

export default ChatContactList