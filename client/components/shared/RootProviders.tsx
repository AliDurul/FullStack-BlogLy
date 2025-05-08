'use client';

import React from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from '@/contexts/ThemeContext';

const queryClient = new QueryClient()

// function SessionWatcher() {
//     const { data: session } = useSession();
// console.log('session in watcher',session);
//     useEffect(() => {
//         if (session?.error) {
//             if (session.error === 'RefreshTokenError') {
//                 toast.error('Session expired. Logging out in 3 seconds. Please log in again.');
//                 signOut();
//                 console.log('---logged out client side');
//             }
//         }
//     }, [session]);

//     return null;
// }

export default function RootProviders({ children }: { children: React.ReactNode }) {
    // console.log('---logged out client side',);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    {children}
                    {/* <SessionWatcher /> */}
                </ThemeProvider>
            </QueryClientProvider>
            <Toaster />
        </>
    )
}
