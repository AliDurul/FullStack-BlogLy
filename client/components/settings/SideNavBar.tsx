'use client';

import { use, useEffect, useRef, useState } from 'react';
import SideNavBarLinks from './SideNavBarLinks'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CheckNoti } from '@/lib/actions/notiActions';
import { useSession } from 'next-auth/react';


const DashboardLinks = [
    {
        name: 'Manage Your Blogs',
        icon: 'fi fi-rr-document',
        href: '/blog-management/?draft=false',
    },
    {
        name: 'Notifications',
        icon: 'fi fi-rr-bell',
        href: '/notifications',
    },
    {
        name: 'Write',
        icon: 'fi fi-rr-file-edit',
        href: '/editor',
    },
];

const SettingsLinks = [
    {
        name: 'Edit Profile',
        icon: 'fi fi-rr-user',
        href: '/edit-profile',
    },
    {
        name: 'Change Password',
        icon: 'fi fi-rr-lock',
        href: '/change-password',
    }
];

export default function SideNavBar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [page, setPage] = useState<string>(pathname.split('/')[1].replace('-', ' '))
    const [showSideNav, setShowSideNav] = useState(false)

    const activeTabLine = useRef<HTMLHRElement>(null);
    const sideBarIconTab = useRef<HTMLButtonElement>(null);
    const pageTab = useRef<HTMLButtonElement>(null);

    const handlePageChange = (e: React.MouseEvent<HTMLButtonElement>) => {

        const { offsetLeft, offsetWidth } = e.currentTarget;

        if (activeTabLine.current) {
            activeTabLine.current.style.width = `${offsetWidth}px`;
            activeTabLine.current.style.left = `${offsetLeft}px`;
        }

        if (e.target === sideBarIconTab.current) {
            setShowSideNav(true)
        } else {
            setShowSideNav(false)
        }
    }


    const { isPending, isError, data } = useQuery({
        queryKey: ['notification'],
        queryFn: CheckNoti,
        enabled: !!session,
    });

    useEffect(() => {
        setShowSideNav(false)
        pageTab.current?.click()
    }, [page])

    return (
        <div className='sticky top-[80px] z-30 '>

            <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto'>
                <button onClick={handlePageChange} ref={sideBarIconTab} className='p-5 capitalize'>
                    <i className='fi fi-rr-bars-staggered pointer-events-none' />
                </button>
                <button onClick={handlePageChange} ref={pageTab} className='p-5 capitalize'>
                    {page}
                </button>
                <hr ref={activeTabLine} className='absolute bottom-0 duration-500' />
            </div>

            {/* Links */}
            <div className={`min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 ${showSideNav ? 'left-0 opacity-100 pointer-events-auto' : 'max-md:opacity-0 max-md:pointer-events-none -left-full'}`}>
                <h1 className='text-xl text-dark-grey mb-3'>
                    Dashboard
                </h1>
                <hr className='border-grey -ml-6 mb-8 mr-6' />

                {
                    DashboardLinks.map((link, index) => (
                        <Link key={index} href={link.href} onClick={() => { setPage(link.name) }} className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}>
                            <div className="relative">

                                <i className={`${link.icon} `} />
                                {
                                    link.name === 'Notifications' && data && 'isNewNotification' in data && data.isNewNotification && <span className='bg-red size-2 rounded-full absolute z-10 top-0 right-0' />
                                }

                            </div>
                            <span>{link.name}</span>
                        </Link>
                    ))
                }

                <h1 className='text-xl text-dark-grey mt-20 mb-3'>Settings</h1>
                <hr className='border-grey -ml-6 mb-8 mr-6' />

                {
                    SettingsLinks.map((link, index) => (
                        <Link key={index} href={link.href} onClick={() => { setPage(link.name) }} className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}>
                            <i className={`${link.icon} `} />
                            <span>{link.name}</span>
                        </Link>
                    ))
                }
            </div>

        </div>
    )
}
