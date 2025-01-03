'use client'
import EditorProvider from '@/contexts/EditorContext'
import React from 'react'

export default function EditorProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <EditorProvider>
                {children}
            </EditorProvider>

        </>
    )
}