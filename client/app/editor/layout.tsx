import EditorProviders from '@/components/shared/EditorProviders';
import type { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Create New Blog | BlogLy",
    description: "Start creating your new blog on BlogLy, the modern blogging platform built with MERN stack. Share your thoughts and ideas with the world.",
    keywords: ["create blog", "new blog", "BlogLy", "write blogs", "blogging platform"],
    openGraph: {
        title: "Create New Blog | BlogLy",
        description: "Start creating your new blog on BlogLy, the modern blogging platform built with MERN stack. Share your thoughts and ideas with the world.",
        url: "https://blogly.vercel.app/editor",
        images: [
            {
                url: "https://blogly.vercel.app/public/assets/images/logo-dark.png",
                width: 1200,
                height: 630,
                alt: "Create New Blog Open Graph Image",
            },
        ],
        type: "website",
        siteName: "BlogLy",
    },
    robots: "index, follow",
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <EditorProviders>
                <main>{children}</main>
            </EditorProviders>
        </>
    )
}
