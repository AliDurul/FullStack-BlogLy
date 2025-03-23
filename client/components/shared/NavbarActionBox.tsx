'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
// import { signOut } from "next-auth/react"
import { TError, TSession } from '@/types/index';
import UserNavigationPanel from './UserNavigationPanel'
import Search from './Search'
// import { useQuery } from '@tanstack/react-query'
import { CheckNoti } from '@/lib/actions/notiActions'
import { useThemeContext } from '@/contexts/ThemeContext';
import darkLogo from '@/public/assets/images/logo-dark.png';
import lightLogo from '@/public/assets/images/logo-light.png';

export default function NavbarActionBox({ session }: { session: TSession }) {

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);
    const { theme, setTheme } = useThemeContext()

    // const { isPending, isError, data } = useQuery({
    //     queryKey: ['notification', session],
    //     queryFn: CheckNoti,
    //     enabled: !!session,
    // });

    const [data, setData] = useState<{ success: boolean, isNewNotification: boolean } | TError>({
        success: false,
        isNewNotification: false,
    })

    const CheckIfNewNotiFn = async () => {
        const res = await CheckNoti()
        setData(res)
    }

    useEffect(() => {
        if (session?.user.username) {
            CheckIfNewNotiFn()
        }
    }, [session])

    const changeTheme = () => {

        const newTheme = theme === 'light' ? 'dark' : 'light'

        setTheme(newTheme)

        localStorage.setItem('theme', newTheme);

        document.body.setAttribute('data-theme', newTheme);
    }



    return (
        <>
            <Link href='/' className='flex-none w-10 ' >
                <Image className='w-full' src={theme == 'light' ? darkLogo : lightLogo} width={40} height={44} alt='logo' />
            </Link>

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

                <button className='size-12 rounded-full bg-grey relative flex items-center justify-center hover:bg-black/10' onClick={changeTheme}>
                    <i className={`fi fi-rr-${theme == 'light' ? 'moon' : 'sun'} text-2xl`} />
                </button>

                {
                    session ?
                        <>
                            <Link href={'/notifications'} className='size-12 rounded-full bg-grey relative flex items-center justify-center hover:bg-black/10'>
                                <i className="fi fi-rr-bell text-2xl" />
                                {
                                    data && 'isNewNotification' in data && data.isNewNotification && <span className='bg-red size-3 rounded-full absolute z-10 top-2 right-2' />
                                }
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
