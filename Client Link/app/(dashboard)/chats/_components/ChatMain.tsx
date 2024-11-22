'use client'
import { useState, useEffect } from 'react';
import Dropdown from '@/app/components/Layout/Dropdown';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import ChatList from './ChatList';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { AllChatsIcon, ContactIcon, GroupChatIcon, HelpIcon, SettingIcon, SignOutIcon, SingleChatIcon } from './ChatIcons';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllChatsAsync, selectChats, selectChatStates, setIsShowChatMenu, } from '@/lib/features/chat/chatSlice';
import { Chat, ChatUser, Kyc } from '@/types/types';
import { coloredToast } from '@/utils/sweetAlerts';
import ChatContactList from './ChatContactList';
import { ChatListSkeleton } from './ChatSkeletons';
import { fetchAllKycAsync } from '@/lib/features/kyc/kycSlice';

const Tabs = [
    { name: 'All', icon: <AllChatsIcon /> },
    { name: 'Chats', icon: <SingleChatIcon /> },
    { name: 'Groups', icon: <GroupChatIcon /> },
    { name: 'Contacts', icon: <ContactIcon /> },
]

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;


const ChatMain = ({ children }: { children: React.ReactNode; }) => {

    const dispatch = useAppDispatch()
    const { userInfo } = useCurrentUser()
    const chats = useAppSelector(selectChats)
    const { status, error, isShowChatMenu } = useAppSelector(selectChatStates)
    const [filteredItems, setFilteredItems] = useState<Chat[] | any>([]);
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTab, setSelectedTab] = useState('All')

    useEffect(() => {
        dispatch(fetchAllChatsAsync({}))
        dispatch(fetchAllKycAsync({}))
    }, [dispatch])

    useEffect(() => {
        setFilteredItems(chats);
    }, [chats]);

    useEffect(() => {
        setFilteredItems(() => {
            return chats?.filter((chat: Chat) => {

                const searchTerm = searchQuery.toLowerCase();

                let isChatNameMatch;
                if (chat.chat_name) {
                    isChatNameMatch = chat.chat_name ? chat.chat_name.toLowerCase().includes(searchTerm) : false;
                }

                const isMemberMatch = chat.chat_users?.some((member: ChatUser) => {
                    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
                    const email = member.email ? member.email.toLowerCase() : '';

                    return fullName.includes(searchTerm) || email.includes(searchTerm);
                });

                const matchesSearch = isChatNameMatch || isMemberMatch;

                switch (selectedTab) {
                    case 'All':
                        return matchesSearch;
                    case 'Chats':
                        return matchesSearch && chat.is_group_chat === false;
                    case 'Groups':
                        return matchesSearch && chat.is_group_chat === true;
                    default:
                        return false;
                }
            });
        });

    }, [searchQuery, chats, selectedTab]);




    useEffect(() => {
        if (error) {
            coloredToast('danger', error);
        }
    }, [error]);


    const selectUser = (chat: Chat) => {
        // setSelectedChat(chat);
        // setIsShowUserChat(true);
        dispatch(setIsShowChatMenu(false))
    };


    return (
        <div className={`mt-5 relative flex h-full gap-5 sm:h-[calc(100vh_-_160px)] sm:min-h-0 ${isShowChatMenu ? 'min-h-[999px]' : ''}`}>
            <div className={`panel absolute z-10 hidden w-full max-w-xs flex-none space-y-4 overflow-hidden p-4 xl:relative xl:block xl:h-full ${isShowChatMenu ? '!block' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-none">
                            <Image width={48} height={48}
                                src={`${BASE_URL}/image/${userInfo?.user_id || '/assets/images/profile.png'}`}
                                className="rounded-full object-cover" alt="" />
                        </div>
                        <div className="mx-3">
                            <p className="mb-1 font-semibold">{userInfo?.payload.first_name} {userInfo?.payload.first_name}</p>
                            <p className="text-xs text-white-dark">--------------</p>
                        </div>
                    </div>
                    <div className="dropdown">
                        <Dropdown
                            offset={[0, 5]}
                            placement={'bottom-end'}
                            btnClassName="bg-[#f4f4f4] dark:bg-[#1b2e4b] hover:bg-primary-light w-8 h-8 rounded-full !flex justify-center items-center hover:text-primary"
                            button={<svg className="opacity-70" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>}>
                            <ul className="whitespace-nowrap">
                                <li>
                                    <button type="button">
                                        <SettingIcon />
                                        Settings
                                    </button>
                                </li>
                                <li>
                                    <button type="button">
                                        <HelpIcon />
                                        Help & feedback
                                    </button>
                                </li>
                                {/* <li>
                                    <button type="button">
                                        <SignOutIcon />
                                        Sign Out
                                    </button>
                                </li> */}
                            </ul>
                        </Dropdown>
                    </div>
                </div>
                {
                    selectedTab !== 'Contacts' && (<div className='flex gap-x-2 mb-3'>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                className="peer form-input ltr:pr-9 rtl:pl-9"
                                placeholder="Searching..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-2 rtl:left-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                                    <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                </svg>
                            </div>
                        </div>
                    </div>)
                }
                <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]" />
                <Tab.Group>
                    <Tab.List className="flex items-center justify-between text-xs">
                        {Tabs.map((tab, i) => (
                            <Tab as={Fragment} key={i}>
                                {({ selected }) => (
                                    <button onClick={() => { setSelectedTab(tab.name) }} type="button" className={`${selected ? 'text-primary' : 'hover:text-primary'}`}>
                                        {tab.icon}
                                        {tab.name}
                                    </button>
                                )}
                            </Tab>
                        ))}
                    </Tab.List>
                    {chats.length === 0 && (<div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]" />)}
                    <Tab.Panels>
                        <Tab.Panel>
                            {
                                status === 'loading'
                                    ? (<ChatListSkeleton />)
                                    : (<ChatList selectUser={selectUser} filteredItems={filteredItems} />)
                            }
                        </Tab.Panel>
                        <Tab.Panel>
                            <ChatList selectUser={selectUser} filteredItems={filteredItems} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <ChatList selectUser={selectUser} filteredItems={filteredItems} selectedTab={selectedTab} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <ChatContactList setSelectedTab={setSelectedTab} selectUser={selectUser}  />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>

            </div>
            <div className={`absolute z-[5] hidden h-full w-full rounded-md bg-black/10 ${isShowChatMenu ? '!block xl:!hidden' : ''}`} onClick={() => dispatch(setIsShowChatMenu(!isShowChatMenu))}></div>

            <div className="panel flex-1 p-0">
                {children}
            </div>
        </div>

    );
};

export default ChatMain;