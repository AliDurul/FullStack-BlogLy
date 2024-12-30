'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react"



export default function NavbarActionBox() {
    const { data: session } = useSession()
    console.log(session);

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)

    return (
        <>
            <div className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${searchBoxVisibility ? 'show' : 'hide'}`}>
                <input
                    type="text"
                    placeholder='Search'
                    className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12' />
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
                        <button onClick={() => signOut()} className='btn-dark py-2'>Sign Out</button>
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
