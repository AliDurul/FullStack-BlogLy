'use client';

import Link from 'next/link'
import React from 'react'

export default function BlogShareBtns({title, tags}: {title: string, tags: string[]}) {
    return (
        <>
            <Link href={`https://x.com/intent/tweet?text=Read ${title}&url=${location.href}`} >
                <i className='fi fi-brands-twitter size-10 text-xl hover:text-twitter' />
            </Link>

            <Link href={`https://www.linkedin.com/feed/?shareActive=true&text=${title} ${location.href} %23${tags[0]}`}>
                <i className='fi fi-brands-linkedin size-10 text-xl hover:text-twitter' />
            </Link>
        </>
    )
}
