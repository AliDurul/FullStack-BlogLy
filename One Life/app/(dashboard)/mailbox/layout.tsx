import TopPageNavigation from '@/app/components/TopPageNavigation';
import React, { ReactNode } from 'react'
import MailMain from './components/MailMain';

interface Props {
    readonly children: ReactNode;
}

export default function MailLayout({ children }: Props) {
    return (
        <>
            <TopPageNavigation />
            <MailMain>
                {children}
            </MailMain>
        </>
    )
}
