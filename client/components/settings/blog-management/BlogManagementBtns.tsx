'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback } from 'react'

export default function BlogManagementBtns() {
    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const draft = searchParams.get('draft') || 'false';

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    );

    return (
        <div className='flex items-center gap-4 mb-8 duration-200'>
            <button
                onClick={() => {
                    router.push(pathname + '?' + createQueryString('draft', 'false'))
                }}
                className={`p-4 px-5 capitalize ${draft === 'false' && 'border-b'}`}>
                Published Blogs
            </button>
            <button
                onClick={() => {
                    router.push(pathname + '?' + createQueryString('draft', 'true'))
                }}
                className={`p-4 px-5 capitalize ${draft === 'true' && 'border-b'}`}>
                Drafts
            </button>
        </div>
    )
}
