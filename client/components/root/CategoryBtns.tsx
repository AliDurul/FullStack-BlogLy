'use client';

import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { revalidatePath, revalidateTag } from 'next/cache';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import { activeTabeRef } from '../auth/InPageNavigation';

export default function CategoryBtn() {
    const categories = ['Tech', 'Science', 'Health', 'Business', 'Entertainment', 'Sports', 'Travel', 'Fashion', 'Food', 'Lifestyle']

    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const [query, setQuery] = useState(category);
    const router = useRouter();

    const handleCategoryFilter = (category: string) => {
        let newUrl = '';

        if (query === category) {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['category']
            });
            setQuery('');
        } else {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'category',
                value: category
            });
            setQuery(category);
        }
        router.push(newUrl, { scroll: false });
    }

    useEffect(() => {
        
        if (activeTabeRef.current) {
            activeTabeRef.current.click();
        }
    
    }, [category])
    

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
