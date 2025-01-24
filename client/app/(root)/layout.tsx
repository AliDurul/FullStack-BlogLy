import React from 'react'
import Navbar from '@/components/shared/Navbar'
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    )
}
