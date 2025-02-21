import React from 'react'
import AnimationWrapper from './AnimationWrapper'
import Link from 'next/link'
import { signOut } from 'next-auth/react'


export default function UserNavigationPanel({ username }: { username: string }) {

  const links = [
    { href: '/editor', label: 'Write', iconClass: 'fi fi-rr-file-edit', hiddenOnMd: true },
    { href: `/user/${username}`, label: 'Profile' },
    { href: '/blogs', label: 'Dashboard' },
    { href: '/edit-profile', label: 'Settings' }
  ];

  return (
    <AnimationWrapper transition={{ duration: 0.5 }} className="absolute right-0 top-[64px]  z-50">
      <div className='bg-white absolute right-0 border border-grey w-60 duration-200'>

        {links.map((link, index) => (
          <Link key={index} href={link.href} className={`flex gap-2 link ${link.hiddenOnMd ? 'md:hidden' : ''} pl-8 py-4`}>
            {link.iconClass && <i className={link.iconClass}></i>}
            <p>{link.label}</p>
          </Link>
        ))}

        <span className='absolute border-t border-grey  w-[100%]' />

        <button className='text-left p-4 hover:bg-grey w-full pl-8 py4' onClick={() => signOut()}>
          <h1 className='font-bold text-xl mb-1'>Sign Out</h1>
          <p className='text-dark-grey'>@{username}</p>
        </button>

      </div>
    </AnimationWrapper>
  )
}
