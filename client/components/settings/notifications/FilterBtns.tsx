'use client';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

export default function FilterBtns() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const category = searchParams.get('category') || 'all';

    const [query, setQuery] = useState(category);

    const categories = ['all', 'like', 'comment', 'reply']

    const handleCategoryFilter = (category: string) => {

        if (query === category) return;

        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'category',
            value: category
        });
        setQuery(category);

        router.push(newUrl, { scroll: false });
    }

    return (
        <div className='my-8 flex gap-6'>
            {
                categories.map((category, i) => (
                    <button onClick={() => handleCategoryFilter(category)} key={i} className={`p-2 ${query == category ? 'btn-dark' : 'btn-light'}`}>{category}</button>
                ))
            }
        </div>
    )
}
