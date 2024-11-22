'use client'
import { useState, useEffect, Children } from 'react';
import Dropdown from '@/app/components/Layout/Dropdown';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import WpContacts from './WpContacts';
import WpChatList from './WpChatList';
import WpChatBox from './WpChatBox';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ChatsIcon, SettingIcon, SignOutIcon, StartChatIcon } from './ChatIcons';
import { Chat } from '@/types/types';

// let chatRooms = [
//     // {
//     //     userId: 15,
//     //     name: 'Nia Hillyer',
//     //     path: 'profile-16.jpeg',
//     //     time: '2:09 PM',
//     //     preview: 'How do you do?',
//     //     messages: [
//     //         {
//     //             fromUserId: 0,
//     //             toUserId: 15,
//     //             text: 'Hi there !',
//     //         },
//     //         {
//     //             fromUserId: 0,
//     //             toUserId: 15,
//     //             text: 'I would like to find out about my account.',
//     //         },

//     //         {
//     //             fromUserId: 15,
//     //             toUserId: 0,
//     //             text: 'How are you?',
//     //         },

//     //         {
//     //             fromUserId: 0,
//     //             toUserId: 15,
//     //             text: 'I am all well',
//     //         },

//     //     ],
//     //     active: true,
//     // },
//     {
//         id: 1,
//         chat_name: null,
//         is_group_chat: false,
//         preview: {
//             content: "Hey, what's up?",
//             created_at: "2024-08-02T10:31:16.338901Z",
//         },
//         group_admin: null,
//         members: [
//             {
//                 "id": 1,
//                 "first_name": "Kev",
//                 "last_name": "Banda",
//                 "phone_number": null,
//                 "email": "admin1@gmail.com",
//                 "profile_pic": null
//             },
//             {
//                 "profile_pic": null,
//                 "id": 15,
//                 "first_name": "ali",
//                 "last_name": "durul",
//                 "phone_number": null,
//                 "email": "ali@gmail.com"
//             }
//         ],
//         created_at: "2024-08-02T10:31:16.338901Z"
//     },
// ];

type WpMainProps = {
    chatRooms: Chat[];
    chatTitle: string;
    image: string;
};

const WpMain = ({ chatTitle, image, chatRooms }: WpMainProps) => {

    const { userInfo } = useCurrentUser()



    const [isShowChatMenu, setIsShowChatMenu] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [isShowUserChat, setIsShowUserChat] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [filteredItems, setFilteredItems] = useState<Chat[]>(chatRooms);

    useEffect(() => {
        setFilteredItems(() => {
            return chatRooms.filter((chat: any) => {

                const searchTerm = searchUser.toLowerCase();

                let isChatNameMatch;
                if (chat.chat_name) {
                    // Check if chat_name matches the search term
                    isChatNameMatch = chat.chat_name ? chat.chat_name.toLowerCase().includes(searchTerm) : false;
                }

                const isMemberMatch = chat.members?.some((member: any) => {
                    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
                    const email = member.email ? member.email.toLowerCase() : '';

                    return fullName.includes(searchTerm) || email.includes(searchTerm);
                });

                return isChatNameMatch || isMemberMatch;
            });
        });
    }, [searchUser, chatRooms]);

    const scrollToBottom = () => {
        if (isShowUserChat) {
            setTimeout(() => {
                const element: any = document.querySelector('.chat-conversation-box');
                element.behavior = 'smooth';
                element.scrollTop = element.scrollHeight;
            });
        }
    };
    const selectUser = (user: any) => {
        setSelectedUser(user);
        setIsShowUserChat(true);
        scrollToBottom();
        setIsShowChatMenu(false);
    };

    return (
        // sm:h-[calc(100vh_-_150px)]
        <div className={`relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)] sm:min-h-0 pt-5 ${isShowChatMenu ? 'min-h-[999px]' : ''}`}>
            <div className={`panel absolute z-10 hidden w-full max-w-xs flex-none space-y-4 overflow-hidden p-4 xl:relative xl:block xl:h-full ${isShowChatMenu ? '!block' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-none">
                            <Image height={50} width={100} src="/assets/images/onelife-logo.png" className="rounded-full object-cover" alt="" />
                        </div>
                        <div className="mx-3">
                            {/* <p className="mb-1 font-semibold">United Bank for Africa</p> */}
                            <p className="text-xs text-white-dark">{chatTitle} Chat</p>
                        </div>
                    </div>
                    <div className="dropdown">
                        <Dropdown
                            offset={[0, 5]}
                            placement={'bottom-end'}
                            btnClassName="bg-[#f4f4f4] dark:bg-[#1b2e4b] hover:bg-primary-light w-8 h-8 rounded-full !flex justify-center items-center hover:text-primary"
                            button={
                                <svg className="opacity-70" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            }
                        >
                            <ul className="whitespace-nowrap">
                                <li>
                                    <button type="button">
                                        <SettingIcon />
                                        Settings
                                    </button>
                                </li>
                                <li>
                                    <button type="button">
                                        <svg className="ltr:mr-1 rtl:ml-1" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                            <path
                                                d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                            <circle cx="12" cy="16" r="1" fill="currentColor" />
                                        </svg>
                                        Help & feedback
                                    </button>
                                </li>
                                <li>
                                    <button type="button">
                                        <SignOutIcon />
                                        Sign Out
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                </div>
                <div className="relative">
                    <input type="text" className="peer form-input ltr:pr-9 rtl:pl-9" placeholder="Searching..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
                    <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-2 rtl:left-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                            <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        </svg>
                    </div>
                </div>
                <Tab.Group>
                    <Tab.List className="flex items-center justify-between text-xs">
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button type="button" className={`${selected ? 'text-primary' : 'hover:text-primary'}`}>
                                    <ChatsIcon />
                                    Chats
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button type="button" className={`${selected ? 'text-primary' : 'hover:text-primary'}`}>
                                    <svg className="mx-auto mb-1" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M5.00659 6.93309C5.04956 5.7996 5.70084 4.77423 6.53785 3.93723C7.9308 2.54428 10.1532 2.73144 11.0376 4.31617L11.6866 5.4791C12.2723 6.52858 12.0372 7.90533 11.1147 8.8278M17.067 18.9934C18.2004 18.9505 19.2258 18.2992 20.0628 17.4622C21.4558 16.0692 21.2686 13.8468 19.6839 12.9624L18.5209 12.3134C17.4715 11.7277 16.0947 11.9628 15.1722 12.8853"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            opacity="0.5"
                                            d="M5.00655 6.93311C4.93421 8.84124 5.41713 12.0817 8.6677 15.3323C11.9183 18.5829 15.1588 19.0658 17.0669 18.9935M15.1722 12.8853C15.1722 12.8853 14.0532 14.0042 12.0245 11.9755C9.99578 9.94676 11.1147 8.82782 11.1147 8.82782"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                    Calls
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button type="button" className={`${selected ? 'text-primary' : 'hover:text-primary'}`}>
                                    <svg className="mx-auto mb-1" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                        <path
                                            opacity="0.5"
                                            d="M18 17.5C18 19.9853 18 22 10 22C2 22 2 19.9853 2 17.5C2 15.0147 5.58172 13 10 13C14.4183 13 18 15.0147 18 17.5Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    Contacts
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button type="button" className={`${selected ? 'text-primary' : 'hover:text-primary'}`}>
                                    <svg className="mx-auto mb-1" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path opacity="0.5" d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    Notification
                                </button>
                            )}
                        </Tab>
                        {/* <Tab className="pointer-events-none -mb-[1px] block p-3.5 py-2 text-white-light outline-none dark:text-dark">Disabled</Tab> */}
                    </Tab.List>
                    <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                    <Tab.Panels>
                        <Tab.Panel>
                            <WpChatList selectUser={selectUser} selectedUser={selectedUser} filteredItems={filteredItems} />
                        </Tab.Panel>
                        <Tab.Panel>

                        </Tab.Panel>
                        <Tab.Panel>

                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>

            </div>
            <div className={`absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowChatMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowChatMenu(!isShowChatMenu)}></div>
            <div className="panel flex-1 p-0">
                {!isShowUserChat && (
                    <div className="relative flex h-full items-center justify-center p-4">
                        <button type="button" onClick={() => setIsShowChatMenu(!isShowChatMenu)} className="absolute top-4 hover:text-primary ltr:left-4 rtl:right-4 xl:hidden">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>

                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="mb-8 h-[calc(100vh_-_320px)] min-h-[120px] w-[280px] text-white dark:text-black md:w-[430px]">
                                <Image src={`/assets/images/${image}.png`} height={500} width={500} alt="Empty Chat" objectFit="contain" />
                            </div>
                            <p className="mx-auto flex max-w-[190px] justify-center rounded-md bg-white-dark/20 p-2 font-semibold">
                                <StartChatIcon />
                                Click User To Chat
                            </p>
                        </div>
                    </div>
                )}
                {isShowUserChat && selectedUser ? (
                    <WpChatBox
                        setIsShowChatMenu={setIsShowChatMenu}
                        isShowChatMenu={isShowChatMenu}
                        selectedUser={selectedUser}
                        scrollToBottom={scrollToBottom}
                        setFilteredItems={setFilteredItems}
                        chatRooms={chatRooms} />
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default WpMain;