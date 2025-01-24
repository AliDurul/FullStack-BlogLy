'use client';

import React from 'react'
import { Toaster } from 'react-hot-toast'
// import NextNProgress from 'nextjs-progressbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

export default function RootProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
            <Toaster />
            {/* <NextNProgress /> */}
        </>
    )
}
