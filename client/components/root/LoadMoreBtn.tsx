'use client';

import { fetchLatestBlogs } from '@/lib/actions/blogActions'
import { formUrlQuery } from '@/lib/utils';
import { button } from 'framer-motion/client'
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

export default function LoadMoreBtn({ state }: { state: any }) {

    const searchParams = useSearchParams()
    const router = useRouter()

    const { details, result } = state

    const category = searchParams.get('category') || '';
    const query = searchParams.get('query') || '';
    const page = (searchParams.get('page') && Number(searchParams.get('page')) + 1) || 1


    const handleClick = () => {


        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'page',
            value: String(page + 1)
        });

        router.push(newUrl, { scroll: false });

        fetchLatestBlogs({ category, query, page })
    }

    if (result && details.totalRecords > result.length) {
        return (
            <button
                className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                onClick={handleClick}
            >
                Load More
            </button>
        )
    }

}
