import { useDebounce } from '@/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

export default function KycSearchInput({ search }: { search: string }) {
    const router = useRouter()
    const initialRender = useRef(true)

    const [text, setText] = useState(search)
    const { debouncedValue: query } = useDebounce(text, 750)

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        }

        const params = new URLSearchParams(window.location.search);

        if (query) params.set('search', query)
        else params.delete('search');

        router.push(`/kyc?${params.toString()}`, { scroll: false });

    }, [query, router])
    return (
        <input
            type="text"
            className="form-input w-auto"
            placeholder="Search..."
            value={text}
            onChange={e => setText(e.target.value)}
        />
    )
}
