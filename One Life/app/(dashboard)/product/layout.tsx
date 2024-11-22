import React, { ReactNode } from 'react'

interface Props {
    readonly children: ReactNode;
}

export default function ProductLayout({ children }: Props) {
    return (
        <div>{children}</div>
    )
}
