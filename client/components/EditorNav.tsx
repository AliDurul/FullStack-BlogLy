'use client'

import { useEditorContext } from '@/contexts/EditorContext'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import toast from 'react-hot-toast'

export default function EditorNav() {
    const { blog: { title, banner }, setBlog } = useEditorContext()

    const handlePublish = () => {
        
        if(!title || !banner){
            return toast.error('Please fill all the fields')
        }
    }

    return (
        <nav className='navbar'>
            <Link href='/' className='flex-none w-10 ' >
                <Image className='w-full' src='/assets/images/logo.png' width={40} height={44} alt='logo' />
            </Link>
            <p className='max-md:hidden text-black line-clamp-1 w-full'>
                {title ? title : 'New Blog'}
            </p>

            <div className='flex gap-4 ml-auto'>
                <button className='btn-dark py-2 ' onClick={handlePublish}>Publish</button>
                <button className='btn-light py-2'>Save Draft</button>
            </div>

        </nav>
    )
}
