import Dropdown from '@/app/components/Layout/Dropdown';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getMessagesForChat, postMessage } from '@/lib/features/chat/chatActions';
import { Chat, Message } from '@/types/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

import PerfectScrollbar from 'react-perfect-scrollbar';
import { ChatBoxCallIcons, ChatBoxDeletecons, ChatBoxSendIcon, ChatBoxShareIcons, ChatBoxSmileIcon, ChatBoxVideoCallIcons, SettingIcon } from './ChatIcons';
import { coloredToast } from '@/utils/sweetAlerts';

interface ChatBoxProps {
    setIsShowChatMenu: (value: boolean) => void;
    selectedChat: Chat;
    isShowChatMenu: boolean;
    scrollToBottom: () => void;
    setFilteredItems: (value: any) => void;
    chats: Chat[];
}

const ChatBox = ({ setIsShowChatMenu, isShowChatMenu, selectedChat, scrollToBottom, setFilteredItems, chats }: ChatBoxProps) => {

    const { userInfo } = useCurrentUser()

    const receiver = selectedChat.chatUsers.find((member: any) => member.id !== userInfo?.id);
    const [messages, setMessages] = useState<Message[]>([]);
    const [textMessage, setTextMessage] = useState<string>('');


    useEffect(() => {
        const fetchMessages = async () => {
            const messages = await getMessagesForChat(selectedChat.id);
            setMessages(messages);
        };

        if (selectedChat) {
            fetchMessages();
        }
    }, [selectedChat]);


    const sendMessage = async () => {
        if (textMessage.trim()) {

            if (receiver?.id) {
                const res = await postMessage(selectedChat.id, { receiverId: receiver?.id, content: textMessage });
                if (!res.isError) {
                    setMessages([...messages, res.message]);
                } else {
                    coloredToast('danger', res.message);
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

    return (
        <div className="relative h-full">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button type="button" className="xl:hidden hover:text-primary " onClick={() => setIsShowChatMenu(!isShowChatMenu)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="relative flex-none">
                        <Image width={40} height={40} src={`/assets/images/${receiver?.profilePic}`} className="rounded-full object-cover sm:h-12 sm:w-12" alt="" />
                        <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                            <div className="h-4 w-4 rounded-full bg-success"></div>
                        </div>
                    </div>
                    <div className="mx-3">
                        <p className="font-semibold">{receiver?.firstName} {receiver?.lastName}</p>
                        <p className="text-xs text-white-dark">{true ? 'Active now' : 'Last seen at ' + 10}</p>
                    </div>
                </div>
                <div className="flex gap-3 sm:gap-5">
                    <button type="button">
                        <ChatBoxCallIcons />
                    </button>

                    <button type="button">
                        <ChatBoxVideoCallIcons />
                    </button>
                    <div className="dropdown">
                        <Dropdown
                            placement={'bottom-end'}
                            btnClassName="bg-[#f4f4f4] dark:bg-[#1b2e4b] hover:bg-primary-light w-8 h-8 rounded-full !flex justify-center items-center"
                            button={
                                <svg className="rotate-90 opacity-70 hover:text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            }
                        >
                            <ul className="text-black dark:text-white-dark">
                                <li>
                                    <button type="button">
                                        <svg className="ltr:mr-2 rtl:ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                                            <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                        </svg>
                                        Search
                                    </button>
                                </li>
                                <li>
                                    <button type="button">
                                        <ChatBoxDeletecons />
                                        Delete
                                    </button>
                                </li>
                                <li>
                                    <button type="button">
                                        <ChatBoxShareIcons />
                                        Share
                                    </button>
                                </li>
                                <li>
                                    <button type="button">
                                        <SettingIcon />
                                        Settings
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
            <PerfectScrollbar className="chat-conversation-box relative h-full sm:h-[calc(100vh_-_300px)]">
                <div className="min-h-[400px] space-y-5 p-4 pb-[68px] sm:min-h-[300px] sm:pb-0">
                    <div className="m-6 mt-0 block">
                        <h4 className="relative border-b border-[#f4f4f4] text-center text-xs dark:border-gray-800">
                            <span className="relative top-2 bg-white px-3 dark:bg-black">{'Today, ' + selectedChat.updatedAt}</span>
                        </h4>
                    </div>
                    {messages && messages.length ? (
                        <>
                            {messages.map((message: Message) => {
                                return (
                                    <div key={message.id}>
                                        <div className={`flex items-start gap-3 ${userInfo?.id === message.senderId ? 'justify-end' : ''}`}>
                                            <div className={`flex-none ${userInfo?.id === message.senderId ? 'order-2' : ''}`}>
                                                {userInfo?.id === message.senderId ? (<Image height={40} width={40} src="/assets/images/onelife-logo.png" className="rounded-full object-cover" alt="" />) : ('')}
                                                {userInfo?.id !== message.senderId ? (<Image width={40} height={40} src={`/assets/images/${receiver?.profilePic}`} className="rounded-full object-cover" alt="" />) : ('')}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`rounded-md bg-black/10 p-4 py-2 dark:bg-gray-800 ${message.senderId === userInfo?.id ? '!bg-primary text-white rounded-br-none' : 'rounded-bl-none '}`}>
                                                        {message.content}
                                                    </div>
                                                    <div className={`${userInfo?.id === message.senderId ? 'hidden' : ''}`}>
                                                        <ChatBoxSmileIcon />
                                                    </div>
                                                </div>
                                                <div className={`text-xs text-white-dark ${userInfo?.id === message.senderId ? 'ltr:text-right rtl:text-left' : ''}`}>
                                                    {message.createdAt ? message.createdAt.toString() : '5h ago'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : ('')}
                </div>
            </PerfectScrollbar>
            <div className="absolute bottom-0 left-0 w-full p-4">
                <div className="w-full items-center space-x-3 sm:flex">
                    <div className="relative flex-1">
                        <input
                            className="form-input rounded-full border-0 bg-[#f4f4f4] px-12 py-2 focus:outline-none"
                            placeholder="Type a message"
                            value={textMessage}
                            onChange={(e: any) => setTextMessage(e.target.value)}
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
            </div>
        </div>
    )
}

export default ChatBox