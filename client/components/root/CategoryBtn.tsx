'use client';

import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { use, useState } from 'react'

export default function CategoryBtn() {
    const categories = ['All', 'Tech', 'Science', 'Health', 'Business', 'Entertainment', 'Sports', 'Travel', 'Fashion', 'Food', 'Lifestyle']

    const searchParams = useSearchParams();
    const [query, setQuery] = useState('All');
    // const query = searchParams.get('category'); 
    const router = useRouter();

    const handleCategoryFilter = (category: string) => {
        let newUrl = '';

        if (category && category !== 'All') {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'category',
                value: category
            })
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['category']
            })
        }
        setQuery(category);
        router.push(newUrl, { scroll: false });

    }

    return (
        <>
            {
                categories.map((category, i) => {
                    return (
                        <button key={i} className={`tag ${query === category ? 'bg-black text-white' : ''}`} onClick={() => handleCategoryFilter(category)}>{category}</button>
                    )
                })
            }
        </>
    )
}
