'use client';
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const categories = ['all', 'like', 'comment', 'reply'];

export default function NotiFilterBtns() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialType = searchParams.get('type') || 'all';
    const [query, setQuery] = useState(initialType);

    const handleCategoryFilter = (type: string) => {
        if (query === type) return;

        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'type',
            value: type
        });
        setQuery(type);
        router.push(newUrl, { scroll: false });
    };

    return (
        <div className='my-8 flex gap-6'>
            {categories.map((type, i) => (
                <FilterButton 
                    key={i} 
                    type={type} 
                    isActive={query === type} 
                    onClick={() => handleCategoryFilter(type)} 
                />
            ))}
        </div>
    );
}

const FilterButton = ({ type, isActive, onClick }: { type: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`p-2 ${isActive ? 'btn-dark' : 'btn-light'}`}>
        {type}
    </button>
);
