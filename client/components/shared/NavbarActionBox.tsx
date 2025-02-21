'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { signOut } from "next-auth/react"
import { TSession } from '@/types/index';
import UserNavigationPanel from './UserNavigationPanel'
import Search from './Search'
import { useQuery } from '@tanstack/react-query'
import { CheckNoti } from '@/lib/actions/notiActions'




export default function NavbarActionBox({ session }: { session: TSession }) {

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)
    const [userNavPanel, setUserNavPanel] = useState(false)

    const { isPending, isError, data } = useQuery({
        queryKey: ['notification', session],
        queryFn: CheckNoti,
        enabled: !!session,
    });

    

    return (
        <>
            <div className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${searchBoxVisibility ? 'show' : 'hide'}`}>
                <Search />
                <Image
                    src="/assets/icons/search.svg"
                    alt="search"
                    className='size-5 absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-dark-grey'
                    width={20} height={20} />
            </div>

            <div className="flex items-center  gap-3 md:gap-6 ml-auto">
                <button
                    className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'
                    onClick={() => setSearchBoxVisibility(prev => !prev)}
                >
                    <i className="fi fi-rr-search text-xl"></i>
                </button>

                <Link href='/editor' className='hidden md:flex gap-2 link'>
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>

                {
                    session ?
                        <>
                            <Link href={'dashboard/notification'}>
                                <button className='size-12 rounded-full bg-grey relative hover:bg-black/10'>
                                    <i className="fi fi-rr-bell text-2xl block mt-1" />
                                    {
                                        data && 'isNewNotification' in data && data.isNewNotification &&<span className='bg-red size-3 rounded-full absolute z-10 top-2 right-2' />
                                    }
                                </button>
                            </Link>
                            <div className='relative' onBlur={() => setTimeout(() => { setUserNavPanel(false) }, 200)} tabIndex={0}>
                                <button className='size-11 mt-1' onClick={() => setUserNavPanel(prev => !prev)}>
                                    <Image
                                        src={session.user.profile_img}
                                        alt="profile"
                                        className='rounded-full w-full h-full object-cover'
                                        width={40} height={40} />
                                </button>

                                {
                                    userNavPanel && <UserNavigationPanel username={session.user.username} />
                                }

                            </div>
                        </>
                        :
                        <>
                            <Link href={'/auth/sign-in'} className='btn-dark py-2'>Sign In</Link>
                            <Link href={'/auth/sign-up'} className='btn-light py-2  hidden md:block'>Sign Up</Link>
                        </>

                }

            </div>
        </>
    )
}
