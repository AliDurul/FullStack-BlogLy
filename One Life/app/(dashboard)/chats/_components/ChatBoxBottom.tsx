'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ChatBoxSendIcon, ChatBoxSmileIcon } from './ChatIcons'
import { Chat, Message } from '@/types/types';
import { getMessagesForChat, postMessage } from '@/lib/features/chat/chatActions';
import { coloredToast } from '@/utils/sweetAlerts';
// import { useSocket } from '@/lib/contexts/SocketContext';



export default function ChatBoxBottom({ receiver, selectedChat, pushMessage, scrollToBottom }: { receiver: any, selectedChat: Chat, pushMessage: (value: Message) => void, scrollToBottom: () => void }) {

    const [textMessage, setTextMessage] = useState<string>('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    //? CUSTOM HOOK
    const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;
    // const socket = useSocket()


    const sendMessage = async () => {
        if (textMessage.trim()) {

            if (receiver?.id) {
                const res = await postMessage(selectedChat.id, { receiver: receiver?.id, content: textMessage });
                if (!res.error) {

                    // socket?.emit('stopTyping', { chatId: selectedChat.id });
                    // socket?.emit('sendMessage', res.message, receiver.id, selectedChat);

                    pushMessage(res.message)
                } else {
                    coloredToast('danger', res.error);
                }
            } else {
                coloredToast('danger', 'Receiver not found');
            }

            setTextMessage('');
            scrollToBottom();
        }
    };

    const sendMessageHandle = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setTextMessage(e.target.value)

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        } else {
            // socket?.emit('typing', { chatId: selectedChat.id });
        }

        typingTimeoutRef.current = setTimeout(() => {
            // socket?.emit('stopTyping', { chatId: selectedChat.id });
            typingTimeoutRef.current = null;
        }, 3000);
    }

    return (
        <div className="w-full items-center space-x-3 sm:flex">
            <div className="relative flex-1">
                <input
                    className="form-input rounded-full border-0 bg-[#f4f4f4] px-12 py-2 focus:outline-none"
                    placeholder="Type a message"
                    value={textMessage}
                    onChange={handleOnchange}
                    onKeyUp={sendMessageHandle}
                />
                <button type="button" className="absolute top-1/2 -translate-y-1/2 hover:text-primary ltr:left-4 rtl:right-4">
                    <ChatBoxSmileIcon />
                </button>
                <button type="button" className="absolute top-1/2 -translate-y-1/2 hover:text-primary ltr:right-4 rtl:left-4" onClick={() => sendMessage()}>
                    <ChatBoxSendIcon />
                </button>
            </div>
            <div className="hidden items-center space-x-3 py-3 rtl:space-x-reverse sm:block sm:py-0">
                <button type="button" className="rounded-md bg-[#f4f4f4] p-2 hover:bg-primary-light hover:text-primary dark:bg-[#1b2e4b]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V8Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path opacity="0.5" d="M13.5 8L17 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M13.5 11L17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M7 8L9 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M7 11L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                            opacity="0.5"
                            d="M20 10V11C20 15.4183 16.4183 19 12 19M4 10V11C4 15.4183 7.58172 19 12 19M12 19V22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path d="M22 2L2 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
                <button type="button" className="rounded-md bg-[#f4f4f4] p-2 hover:bg-primary-light hover:text-primary dark:bg-[#1b2e4b]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            opacity="0.5"
                            d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path d="M12 2L12 15M12 15L9 11.5M12 15L15 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button type="button" className="rounded-md bg-[#f4f4f4] p-2 hover:bg-primary-light hover:text-primary dark:bg-[#1b2e4b]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" />
                        <path
                            opacity="0.5"
                            d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path d="M19 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
                <button type="button" className="rounded-md bg-[#f4f4f4] p-2 hover:bg-primary-light hover:text-primary dark:bg-[#1b2e4b]">
                    <svg className="opacity-70" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
