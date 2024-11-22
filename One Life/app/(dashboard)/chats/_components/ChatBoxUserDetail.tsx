'use client'
import { useAppSelector } from '@/lib/hooks'
import React from 'react'
import ChatBurgerBtn from './ChatBurgerBtn'
import Image from 'next/image'
import { selectActiveUsers } from '@/lib/features/kyc/kycSlice'
import { Chat, ChatUser } from '@/types/types'


const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;

export default function ChatBoxUserDetail({ selectedChat, receiver }: { selectedChat: Chat, receiver: ChatUser }) {
    const activeUsers = useAppSelector(selectActiveUsers)

    return (

        <div className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
            <ChatBurgerBtn />
            <div className="relative flex-none">
                <Image
                    width={40}
                    height={40}
                    src={`${selectedChat?.is_group_chat ? `${BASE_URL}/image/${selectedChat?.chat_picture || '/assets/images/profile.png'}` : `${BASE_URL}/image/${receiver?.profile_pic || '/assets/images/profile.png'}`}`}
                    className="rounded-full object-cover sm:h-12 sm:w-12" alt="" />

                {
                    !selectedChat.is_group_chat && activeUsers.some(user => user.userId === receiver?.id) && (
                        <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                            <div className="size-3 rounded-full bg-success"></div>
                        </div>
                    )
                }
            </div>
            <div className="mx-3">
                <p className="font-semibold">{selectedChat.is_group_chat ? `${selectedChat?.chat_name}` : `${receiver.first_name} ${receiver?.last_name}`}</p>
                <p className="text-xs text-white-dark">{ activeUsers.some(user => user.userId === receiver?.id) ? 'Active now' : 'Last seen at ' + '...'}</p>
            </div>
        </div>

    )
}
