'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ChatBoxSmileIcon } from './ChatIcons';
import ChatBoxBottom from './ChatBoxBottom';
import { Message } from '@/types/types';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { selectActiveUsers } from '@/lib/features/user/userSlice';
// import { selectSocket } from '@/lib/features/socket/socketSlice';
// import { useSocket } from '@/lib/contexts/SocketContext';

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;

export default function ChatBoxBody({ chatboxData, receiver }: { chatboxData: any, receiver: any }) {

    // const dispatch = useAppDispatch()


    //? CUSTOM HOOK
    const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;
    // const socket = useSocket()


    const { userInfo } = useCurrentUser()
    // const activeUsers = useAppSelector(selectActiveUsers)

    const { messages, selectedChat } = chatboxData
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [chatMessages, setChatMessages] = useState<Message[]>(messages)


    // useEffect(() => {
    //     if (socket && selectedChat) {
    //         socket.emit('joinRoom', selectedChat.id);
    //     }

    //     socket?.on('receiveMessage', (message: Message) => {
    //         setChatMessages((prevMessages) => [...prevMessages, message]);
    //     })

    //     socket?.on('typing', () => {
    //         setIsTyping(true);
    //     });

    //     socket?.on('stopTyping', () => {
    //         setIsTyping(false);
    //     });

    //     return () => {
    //         if (socket && selectedChat) {
    //             socket.emit('leaveRoom', selectedChat.id);
    //             socket.off('receiveMessage');
    //             socket.off('typing');
    //             socket.off('stopTyping');
    //         }
    //     }

    // }, [selectedChat, socket]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, isTyping]);

    const scrollToBottom = () => {
        setTimeout(() => {
            const element: any = document.querySelector('.chat-conversation-box');
            element.behavior = 'smooth';
            element.scrollTop = element.scrollHeight;
        });
    };

    const showProfilePic = (currentMessage: Message, nextMessage: Message | undefined) => {
        return !nextMessage || currentMessage.sender !== nextMessage.sender;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const isNewDay = (currentMessage: Message, previousMessage: Message | undefined) => {
        if (!previousMessage) return true;
        const currentDate = new Date(currentMessage.created_at).toDateString();
        const previousDate = new Date(previousMessage.created_at).toDateString();
        return currentDate !== previousDate;
    };

    return (
        <>
            <PerfectScrollbar className="chat-conversation-box relative h-full sm:h-[calc(100vh_-_310px)]">
                <div className="min-h-[400px] space-y-3 p-4 pb-[68px] sm:min-h-[300px] sm:pb-0">

                    {chatMessages && chatMessages?.length > 0 ? (
                        <>
                            {chatMessages?.map((message: Message, i: number) => {
                                const nextMessage = chatMessages[i + 1];
                                const previousMessage = chatMessages[i - 1];
                                const showDateHeader = isNewDay(message, previousMessage);
                                let senderPic;

                                if (selectedChat.isGroupChat) {
                                    senderPic = selectedChat.chatUsers.find((user: any) => user.id === message.sender).profilePic;
                                }


                                return (
                                    <div key={message.id}>
                                        {showDateHeader && (
                                            <div className="m-6 mt-0 block ">
                                                <h4 className="relative border-b  border-[#f4f4f4] text-center text-xs dark:border-gray-800 ">
                                                    <span className="relative top-2 bg-white px-3 dark:bg-black">{formatDate(message.created_at.toString())}</span>
                                                </h4>
                                            </div>
                                        )}

                                        <div className={`flex items-start gap-3 ${userInfo?.user_id === message.sender ? 'justify-end' : ''}`}>
                                            <div className={`flex-none ${userInfo?.user_id === message.sender ? 'order-2' : ''}`}>
                                                {/* {showProfilePic(message, nextMessage) && userInfo?.id !== message.senderId ? (
                                                    <Image width={40} height={40} src={`${BASE_URL}/image/${receiver?.profilePic}`} className="rounded-full object-cover" alt="" />
                                                ) : ('')} */}

                                                {
                                                    selectedChat.isGroupChat ? (
                                                        <Image height={40} width={40} src={`${BASE_URL}/image/${senderPic}`} className="rounded-full object-cover" alt="" />
                                                    ) : (
                                                        userInfo?.user_id === message.sender ? (
                                                            <Image height={40} width={40} src={`${BASE_URL}/image/${userInfo?.payload.first_name}`} className="rounded-full object-cover" alt="" />
                                                        ) : (
                                                            <Image width={40} height={40} src={`${BASE_URL}/image/${receiver?.profilePic}`} className="rounded-full object-cover" alt="" />
                                                        )
                                                    )
                                                }




                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={` relative rounded-md bg-black/10 p-2 py-3 pr-11 dark:bg-gray-800 ${message.sender === userInfo?.user_id ? '!bg-primary text-white rounded-br-none' : 'rounded-bl-none '}`}>
                                                    {message.content}
                                                    <div className={`absolute bottom-1 right-1  text-xs text-white-dark ${userInfo?.user_id === message.sender ? 'ltr:text-right ltr:text-white-light rtl:text-left' : ''}`}>
                                                        {formatTime(message.created_at.toString())}
                                                    </div>
                                                </div>
                                                <div className={`${userInfo?.user_id === message.sender ? 'hidden' : ''}`}>
                                                    <ChatBoxSmileIcon />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : null}

                    {
                        isTyping && (
                            <div className={`rounded-full w-fit bg-black/10 p-3 dark:bg-gray-800 flex gap-2`}>
                                <div className='w-2 h-2 bg-slate-500 rounded-xl animate-typing delay-0'></div>
                                <div className='w-2 h-2 bg-slate-500 rounded-xl animate-typing delay-200'></div>
                                <div className='w-2 h-2 bg-slate-500 rounded-xl animate-typing delay-400'></div>
                            </div>
                        )
                    }
                </div>
            </PerfectScrollbar>
            <div className="absolute bottom-0 left-0 w-full p-4 ">
                <ChatBoxBottom receiver={receiver} selectedChat={selectedChat} pushMessage={(msg: Message) => setChatMessages((prevMessages) => [...prevMessages, msg])} scrollToBottom={scrollToBottom} />
            </div>
        </>

    )
}
