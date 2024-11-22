'use client'
import { selectChatStates, setIsShowChatMenu } from '@/lib/features/chat/chatSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import React from 'react'

export default function ChatBurgerBtn({ customClass }: { customClass?: string }) {
    const dispatch = useAppDispatch()
    const { isShowChatMenu } = useAppSelector(selectChatStates)

    return (
        <button type="button" onClick={() => dispatch(setIsShowChatMenu(!isShowChatMenu))} className={` ${customClass && customClass} hover:text-primary xl:hidden`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        </button>
    )
}
