'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


const DashboardLinks = [
    {
        name: 'Blogs',
        icon: 'fi fi-rr-document',
        href: '/blogs',
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
        href: '/settings/edit-profile',
    },
    {
        name: 'Change Password',
        icon: 'fi fi-rr-lock',
        href: '/settings/change-password',
    }
];

export default function SideNavBarLinks() {
    const pathname = usePathname()
    console.log(pathname);

    return (
        <div className='min-w-[200px] h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 '>
            <h1 className='text-xl text-dark-grey mb-3'>Dashboard</h1>
            <hr className='border-grey -ml-6 mb-8 mr-6' />

            {
                DashboardLinks.map((link, index) => (
                    <Link key={index} href={link.href} className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}>
                        <i className={`${link.icon} `} />
                        <span>{link.name}</span>
                    </Link>
                ))
            }

            <h1 className='text-xl text-dark-grey mt-20 mb-3'>Settings</h1>
            <hr className='border-grey -ml-6 mb-8 mr-6' />

            {
                SettingsLinks.map((link, index) => (
                    <Link key={index} href={link.href} className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}>
                        <i className={`${link.icon} `} />
                        <span>{link.name}</span>
                    </Link>
                ))
            }
        </div>
    )
}
