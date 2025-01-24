import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type MiniUserCardProps = {
    user: any
}

export default function MiniUserCard({ user }: MiniUserCardProps) {

    const { personal_info: { fullname, username, profile_img } } = user;


    return (
        <Link href={`/user/${username}`} className='flex gap-5 items-center mb-5' >
            <Image src={profile_img} alt={fullname} width={40} height={40} className='rounded-full size-4' />

            <div>
                <h1 className='font-medium text-xl line-clamp-3'>{fullname}</h1>
                <p className='text-dark-grey'>@{username}</p>
            </div>

        </Link>
    )
}
