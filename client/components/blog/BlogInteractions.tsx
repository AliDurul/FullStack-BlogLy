'use client';

import { ISingleBlog } from '@/types/blogTypes';
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'

interface IBlogInteractionProps {
    blog: ISingleBlog
}


export const LikeCommentBtn = ({ data, icon }: { data: number, icon: string }) => {
    return (
        <>
            <button className='size-10 rounded-full flex items-center justify-center bg-grey/80'>
                <i className={`fi fi-rr-${icon}`} />
            </button>
            <p className='text-xl text-dark-grey'>{data}</p>
        </>
    )
}



export default function BlogInteractions({ blog }: IBlogInteractionProps) {
    const { data: session } = useSession()

    const { title, tags, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { fullname, username: author_username, profile_img } } } = blog


    return (
        <>
            <hr className='border-grey border-2 my-2' />

            <div className='flex justify-between '>

                <div className='flex gap-3 items-center'>
                    <LikeCommentBtn data={total_likes} icon={'heart'} />
                    <LikeCommentBtn data={total_comments} icon={'comment-dots'} />
                </div>

                <div className='flex gap-6 items-center'>

                    {
                        session?.user?.username === author_username &&
                        <Link href={`/editor/${blog_id}`}>
                            <button className='size-10 rounded-full flex items-center justify-center bg-grey/80'>
                                <i className='fi fi-rr-edit' />
                            </button>
                        </Link>
                    }

                    <Link href={`https://x.com/intent/tweet?text=Read ${title}&url=${location.href}`} >
                        <i className='fi fi-brands-twitter size-10 text-xl hover:text-twitter' />
                    </Link>

                    <Link href={`https://www.linkedin.com/feed/?shareActive=true&text=${title} ${location.href} %23${tags[0]}`}>
                        <i className='fi fi-brands-linkedin size-10 text-xl hover:text-twitter' />
                    </Link>
                </div>


            </div>
            <hr className='border-grey my-2 border-2' />
        </>
    )
}
