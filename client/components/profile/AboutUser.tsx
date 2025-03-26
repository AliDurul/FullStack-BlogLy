import { getFullDay } from '@/lib/utils';
import { ISocialLinks } from '@/types/userTypes';
import Link from 'next/link';
import React from 'react'


type TAboutUserProps = {
    className?: string;
    social_links: ISocialLinks;
    bio: string;
    joinedAt: Date;
}

export default function AboutUser({ bio, social_links, joinedAt, className }: TAboutUserProps) {
    return (
        <div className={`md:w-[95%] ${className} `}>
            <p className='text-xl leading-7'> {bio.length ? bio : 'Nothing to show here'} </p>
            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
                {
                    Object.keys(social_links).map((key: string, i: number) => {

                        let link = social_links[key as keyof ISocialLinks]

                        if (!link) return null

                        return (
                            <Link key={i} href={social_links[key as keyof ISocialLinks]} target='_blank' className='flex items-center gap-1'>
                                <i className={`text-2xl hover:text-black fi ${key !== 'website' ? 'fi-brands-' + key : 'fi-rr-globe'}`} />
                            </Link>
                        )
                    })
                }
            </div>
            <p className='text-xl leading-7 text-left'> Joined on {getFullDay(joinedAt)} </p>
        </div>
    )
}
