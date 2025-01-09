'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function PublishHeaderBtn() {
    const router = useRouter()
    return (
        <button
            onClick={() => router.back()}
            className='size-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]'>
            <i className='fi fi-br-cross' />
        </button>
    )
}
