import { formatDate } from '@/lib/utils'
import { IPersonalInfo, ISingleBlog } from '@/types/blogTypes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function BlogCard({ blog, author }: { blog: ISingleBlog, author: IPersonalInfo }) {


    const { publishedAt, tags, title, des, banner, activity: { likes }, blog_id: id } = blog
    const { fullname, profile_img, username } = author

    return (
        <Link href={`/blog/${id}`} className='flex items-center border-b-2 border-grey pb-5 mb-4 gap-8'>
            <div className='w-full '>
                <div className="flex gap-2 items-center mb-7">
                    <Image src={profile_img} alt={fullname} width={40} height={40} className='rounded-full size-9' />
                    <p className='font-semibold text-black line-clamp-1'>@{username}</p>
                    <p className="min-w-fit "> 📅{formatDate(publishedAt)} </p>
                </div>
                <h1 className='blog-title'>{title}</h1>
                <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{des}</p>
                <div className='flex gap-4 mt-7'>
                    <span className='btn-light py-1 px-4 text-sm md:text-base'>{tags[0]}</span>
                    <span className='ml-3 flex items-center gap-2 text-dark-grey cursor-pointer'>
                        <i className='fi fi-rr-heart text-xl' />
                        {likes?.length}
                    </span>
                </div>
            </div >
            <div className="h-28 aspect-square bg-grey">
                <Image src={banner} className='w-full h-full aspect-square object-cover' width={150} height={150} alt={title} />
            </div>
        </Link>
    )
}
