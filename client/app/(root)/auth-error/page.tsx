'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react'

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div>
            <h1>Authentication Error</h1>
            <p>{error ? `Error: ${error}` : 'An unknown error occurred during authentication.'}</p>
            <a href="/">Go back to Home</a>
        </div>
    );
}