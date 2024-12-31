
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavbarActionBox from './NavbarActionBox'
import { auth } from '@/auth'
import getSession from "@/lib/utils";


export default async function Navbar() {
  const session = await getSession()
  // console.log('navbar session==>', session);
  return (
    <nav className='navbar'>
      <Link href='/' className='flex-none w-10 ' >
        <Image className='w-full' src='/assets/images/logo.png' width={40} height={44} alt='logo' />
      </Link>

      <NavbarActionBox session={session} />
    </nav>
  )
}
