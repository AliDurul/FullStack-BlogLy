import EditorProviders from '@/components/shared/EditorProviders';
import React from 'react'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <EditorProviders>
                <main>{children}</main>
            </EditorProviders>
        </>
    )
}
