import React from 'react'

export default async function SearchPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params


    return (
        <div>{slug}</div>
    )
}
