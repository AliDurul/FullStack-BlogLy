'use client'

import { useEditorContext } from '@/contexts/EditorContext'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function EditorNav() {
    const { blog: { title } } = useEditorContext()
    
    return (
        <nav className='navbar'>
            <Link href='/' className='flex-none w-10 ' >
                <Image className='w-full' src='/assets/images/logo.png' width={40} height={44} alt='logo' />
            </Link>
            <p className='max-md:hidden text-black line-clamp-1 w-full'>
                {title ? title : 'New Blog'}
            </p>

            <div className='flex gap-4 ml-auto'>
                <button className='btn-dark py-2 '>Publish</button>
                <button className='btn-light py-2'>Save Draft</button>
            </div>

        </nav>
    )
}
