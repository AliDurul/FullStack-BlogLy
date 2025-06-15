import { ISingleBlog } from '@/types/blogTypes';
import Link from 'next/link';
import React from 'react';
import getSession from '@/lib/utils';
import LikeBtn from './LikeBtn';
import CommentBtn from './CommentBtn';
import BlogShareBtns from './BlogShareBtns';

interface IBlogInteractionProps {
    blog: ISingleBlog
}

export default async function BlogInteractions({ blog }: IBlogInteractionProps) {

    const session = await getSession()

    const { title, tags, blog_id, author: { personal_info: { username: author_username } } } = blog


    return (
        <>
            <hr className='border-grey border-2 my-2' />

            <div className='flex justify-between '>

                <div className='flex gap-3 items-center'>
                    <LikeBtn blog={blog} session={session} />
                    <CommentBtn blog={blog} session={session} />
                    <span className='ml-3 flex items-center justify-center gap-2 text-dark-grey '>
                        <i className='fi fi-rr-eye text-xl' />
                        {blog.activity.total_reads || 0}
                    </span>
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

                    <BlogShareBtns title={title} tags={tags} />

                </div>


            </div>
            <hr className='border-grey my-2 border-2' />
        </>
    )
}
