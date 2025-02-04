'use client';

import { ISingleBlog } from '@/types/blogTypes'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const CommentsContainer = dynamic(() => import('./CommentsContainer'))

export default function CommentBtn({ blog }: { blog: ISingleBlog }) {
    const [open, setOpen] = useState(false)

    const [totalParentLoaded, setTotalParentLoaded] = useState(0)

    return (
        <>
            <button onClick={() => setOpen(prev => !prev)} className={`size-10 rounded-full flex items-center justify-center bg-grey/80`}>
                <i className={`fi fi-rr-comment-dots `} />
            </button>
            <p className='text-xl text-dark-grey'>{blog.activity.total_comments}</p>

            {

                open && <CommentsContainer setOpen={setOpen} open={open} blog={blog} />
            }
        </>
    )
}
