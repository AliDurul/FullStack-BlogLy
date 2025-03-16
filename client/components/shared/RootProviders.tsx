'use client';

import React from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from '@/contexts/ThemeContext';

const queryClient = new QueryClient()

export default function RootProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
            <Toaster />
        </>
    )
}
