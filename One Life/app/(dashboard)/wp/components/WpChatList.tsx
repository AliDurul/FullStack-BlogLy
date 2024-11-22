'use client'
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Chat } from '@/types/types';
import React from 'react'

import PerfectScrollbar from 'react-perfect-scrollbar';

interface WpChatListProps {
    filteredItems: Chat[];
    selectUser: (chat: any) => void;
    selectedUser: any;

}

const WpChatList = ({ filteredItems, selectUser, selectedUser }: WpChatListProps) => {
    const { userInfo } = useCurrentUser()
    
    return (
        <div className="!mt-0">
            <PerfectScrollbar className="chat-users relative -mr-3.5 h-full min-h-[100px] space-y-0.5 pr-3.5 sm:h-[calc(100vh_-_357px)]">
                {filteredItems.map((chat: any) => {
                    const member = chat.members.filter((member: any) => member.id !== userInfo?.user_id);
                    return (
                        <div key={chat.id}>
                            <button
                                type="button"
                                className={`flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-100 hover:text-primary dark:hover:bg-[#050b14] dark:hover:text-primary ${selectedUser && selectedUser.id === chat.id ? 'bg-gray-100 text-primary dark:bg-[#050b14] dark:text-primary' : ''
                                    }`}
                                onClick={() => selectUser(chat)}
                            >

                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <div className="relative flex-shrink-0">
                                            <img src={`/assets/images/${member[0].profile_pic}`} className="h-12 w-12 rounded-full object-cover" alt="" />
                                            <div>
                                                <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                                                    <div className="h-4 w-4 rounded-full bg-success"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mx-3 ltr:text-left rtl:text-right">
                                            {
                                                chat.is_group_chat
                                                    ? <p className="mb-1 font-semibold">{chat.chat_name}</p>
                                                    : <p className="mb-1 font-semibold">{member[0].first_name} {member[0].last_name}</p>

                                            }
                                            <p className="max-w-[185px] truncate text-xs text-white-dark">{chat.preview?.content}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="whitespace-nowrap text-xs font-semibold">
                                    <p>{chat.preview?.created_at}</p>
                                </div>
                            </button>
                        </div>
                    );
                })}
            </PerfectScrollbar >
        </div >
    )
}

export default WpChatList