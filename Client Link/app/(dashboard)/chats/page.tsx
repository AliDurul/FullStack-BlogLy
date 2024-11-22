import React from 'react'
import { getAllChats } from '@/lib/features/chat/chatActions'
import { PhoneChatIcon, StartChatIcon } from './_components/ChatIcons'
import ChatBurgerBtn from './_components/ChatBurgerBtn'

export default async function ChatPage() {


    return (
        <div className="relative flex h-full items-center justify-center p-4">
            <ChatBurgerBtn customClass={'absolute top-4 ltr:left-4'} />
            <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-8 h-[calc(100vh_-_320px)] min-h-[120px] w-[280px] text-white dark:text-black md:w-[430px]">
                    <PhoneChatIcon />
                </div>
                <p className="mx-auto flex max-w-[190px] justify-center rounded-md bg-white-dark/20 p-2 font-semibold">
                    <StartChatIcon />
                    Click User To Chat
                </p>
            </div>
        </div>
    )
}
