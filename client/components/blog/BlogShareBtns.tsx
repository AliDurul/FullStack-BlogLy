'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function BlogShareBtns({ title, tags }: { title: string, tags: string[] }) {

    const [url, setUrl] = useState('');

    useEffect(() => {
        // if (typeof window !== 'undefined') {
        //     setUrl(window.location.href);
        // }
        setUrl(window.location.href);
    }, []);

    return (
        <>
            <Link href={`https://x.com/intent/tweet?text=Read ${title}&url=${url}`} >
                <i className='fi fi-brands-twitter size-10 text-xl hover:text-twitter' />
            </Link>

            <Link href={`https://www.linkedin.com/feed/?shareActive=true&text=${title} ${url} %23${tags[0]}`}>
                <i className='fi fi-brands-linkedin size-10 text-xl hover:text-twitter' />
            </Link>
        </>
    )
}
