
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavbarActionBox from './NavbarActionBox'
import getSession from "@/lib/utils";


export default async function Navbar() {
  const session = await getSession()

  return (
    <nav className='navbar z-50'>
      <NavbarActionBox session={session} />
    </nav>
  )
}
