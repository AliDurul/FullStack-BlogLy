'use client'
// import { headers } from 'next/headers';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react'

// interface TopPageNavigationProps {
//     main: { title: string, url: string },
//     subTitle: { title: string, url: string },
//     miniTitle?: { title: string }
// }

// const TopPageNavigation = ({ main, subTitle, miniTitle }: TopPageNavigationProps) => {
const TopPageNavigation = () => {

    const pathName = usePathname()

    const subbTitle = useMemo(() => pathName.split('/')[1] || '', [pathName]);
    const minititle = useMemo(() => pathName.split('/')[2] || '', [pathName]);

    return (
        <ol className="flex pl-1 text-gray-500 font-semibold dark:text-white-dark ">
            <li>
                <Link href='/' className="hover:text-gray-500/70 dark:hover:text-white-dark/70">DASHBOARD</Link>
            </li>
            {
                subbTitle &&
                <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                    <Link href={`/${subbTitle}`} className={`hover:text-gray-500/70 dark:hover:text-white-dark/70 ${!minititle && 'text-primary'}`}>{subbTitle.toUpperCase()}</Link>
                </li>
            }
            {
                minititle &&
                <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                    <button className="text-primary  truncate ">{minititle.slice(0,90)}</button>
                </li>
            }

        </ol>
    )
}

export default TopPageNavigation