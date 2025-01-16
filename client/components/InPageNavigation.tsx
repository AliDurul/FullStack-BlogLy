'use client';

import React, { act, useEffect, useState } from 'react'

export default function InPageNavigation({ routes, defaultHidden = [], defaultActiveIndex = 0, children }: { children: React.ReactNode, routes: string[], defaultHidden?: string[], defaultActiveIndex?: number }) {
    // const router = useRouter();
    const activeTabLineRef = React.useRef<HTMLHRElement>(null);
    const activeTabeRef = React.useRef<HTMLButtonElement>(null);

    const [navIndex, setNavIndex] = useState(defaultActiveIndex)

    const changePageState = (btn: HTMLButtonElement, i: number) => {
        // const btn = e.currentTarget;
        const { offsetLeft, offsetWidth } = btn;

        if (activeTabLineRef.current) {
            activeTabLineRef.current.style.width = `${offsetWidth}px`;
            activeTabLineRef.current.style.left = `${offsetLeft}px`;

            setNavIndex(i);
        }
    }

    useEffect(() => {
        if (activeTabeRef.current) {
            changePageState(activeTabeRef.current, defaultActiveIndex);
        }

    }, [defaultActiveIndex])




    return (
        <>
            <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
                {
                    routes.map((route, i) => (
                        <button
                            ref={i === defaultActiveIndex ? activeTabeRef : null}
                            onClick={e => { changePageState(e.currentTarget, i); }}
                            key={i} className={`p-4 px-5 capitalize ${navIndex === i ? 'text-black' : 'text-dark-grey'} ${defaultHidden.includes(route) ? 'md:hidden' : ''}`}>
                            {route}
                        </button>
                    ))
                }

                <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300' />
            </div >

            {
                Array.isArray(children) ? children[navIndex] : children
            }
        </>
    )
}
