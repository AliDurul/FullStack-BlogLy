import { formatDate } from '@/lib/utils';
import { ITrendingBlog } from '@/types/blogTypes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function MinimalBlogCard({ blog, index }: { blog: ITrendingBlog, index: any }) {

    const { title, blog_id: id, author: { personal_info: { fullname, username, profile_img } }, publishedAt } = blog;

    return (
        <Link href={`/blog/${id}`} className='flex gap-5 mb-8 items-center'>
            <h1 className='blog-index'>{index < 10 ? "0" + (index + 1) : index}</h1>

            <div>
                <div className="flex gap-2 items-center mb-3">
                    <Image src={profile_img} alt={fullname} width={40} height={40} className='rounded-full size-7' />
                        <p className='line-clamp-1'>@{username}</p>

                        <p className="min-w-fit ml-auto"> 📅{formatDate(publishedAt)} </p>
                </div>
                <h1 className='blog-title'>{title}</h1>
            </div>
        </Link>
    )
}
