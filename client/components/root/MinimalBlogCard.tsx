import { formatDate } from '@/lib/utils';
import { TTrendingBlog } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function MinimalBlogCard({ blog, index }: { blog: TTrendingBlog, index: any }) {

    const { title, blog_id: id, author: { personal_info: { fullname, username, profile_img } }, publishedAt } = blog;

    return (
        <Link href={`/blog/${id}`} className='flex gap-5 mb-8 '>
            <h1 className='blog-index'>{ index < 10 ? "0" + (index + 1) : index }</h1>

            <div>
                <div className="flex gap-2 items-center mb-7">
                    <Image src={profile_img} alt={fullname} width={40} height={40} className='rounded-full size-6' />
                    <p className='line-clamp-1'>{fullname} @{username}</p>
                    <div className="min-w-fit"> {formatDate(publishedAt)} </div>
                </div>
                <h1 className='blog-title'>{title}</h1>
            </div>
        </Link>
    )
}
