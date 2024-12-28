
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavbarActionBox from './NavbarActionBox'

export default function Navbar() {
  return (
    <nav className='navbar'>
      <Link href='/' className='flex-none w-10 ' >
        <Image className='w-full' src='/assets/images/logo.png' width={40} height={44} alt='logo' />
      </Link>

      <NavbarActionBox />
    </nav>
  )
}
