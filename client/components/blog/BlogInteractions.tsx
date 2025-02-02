
import { ISingleBlog } from '@/types/blogTypes';
import Link from 'next/link';
import React from 'react';
import getSession from '@/lib/utils';
import BlogShareBtns from './BlogShareBtns';
import { LikeCommentBtn } from './LikeCommentBtn';

interface IBlogInteractionProps {
    blog: ISingleBlog
}






export default async function BlogInteractions({ blog }: IBlogInteractionProps) {
    // const { data: session } = useSession()

    const session = await getSession()

    const { title, tags, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { fullname, username: author_username, profile_img } } } = blog




    return (
        <>
            <hr className='border-grey border-2 my-2' />

            <div className='flex justify-between '>

                <div className='flex gap-3 items-center'>
                    <LikeCommentBtn data={total_likes} icon={'heart'} blog={blog} session={session} />
                    <LikeCommentBtn data={total_comments} icon={'comment-dots'} blog={blog} session={session}/>
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
