'use client';

import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { activeTabeRef } from '../auth/InPageNavigation';

export default function Search() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState('');


    useEffect(() => {

        const delayBounceFn = setTimeout(() => {

            let newUrl = '';

            if (query) {
                newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'search',
                    value: query
                });
            } else {
                newUrl = removeKeysFromQuery({
                    params: searchParams.toString(),
                    keysToRemove: ['search']
                });
                router.push(newUrl, { scroll: false });
            }

            router.push(newUrl, { scroll: false });
        }, 500)

        if (activeTabeRef.current) {
            activeTabeRef.current.click();
        }

        return () => clearTimeout(delayBounceFn)

    }, [query, searchParams, router])



    return (
        <input
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder='Search'
            className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12' />
    )
}
