import { formatDate, getFullDay } from '@/lib/utils'
import { INoti } from '@/types/notiTypes'
import Image from 'next/image'
import Link from 'next/link'
import React, { useActionState, useState } from 'react'
import NotiCardCommentField from './noticard-comment-field'
import { createComment } from '@/lib/actions/blogActions'

export default function NotiCard({ notification, index }: { notification: INoti, index: number }) {

    const [isReplying, setIsReplying] = useState(false)

    const { _id: notificationId, createdAt, comment, replied_on_comment, type, user, user: { personal_info: { profile_img, fullname, username } }, blog: { blog_id, title, _id: blogId } } = notification

    const handleReplyCLik = () => {
        setIsReplying(prev => !prev)
    }


    return (
        <div className='p-6 border-b border-grey border-l-black '>
            <div className='flex gap-5 mb-3'>
                <Image
                    src={profile_img}
                    alt={fullname}
                    width={40} height={40}
                    className='rounded-full flex-none size-14'
                />
                <div className='w-full'>
                    <h1 className='font-medium text-xl text-dark-grey'>
                        <span className='lg:inline-block hidden capitalize'>{fullname}</span>
                        <Link className='mx-1 text-black underline' href={`/user/${username}`} >@{username}</Link>
                        <span className='font-normal'>
                            {
                                type === 'like'
                                    ? ' Liked your blog'
                                    : type === 'comment'
                                        ? ' Commented on your blog'
                                        : 'Replied on'
                            }
                        </span>
                    </h1>
                    {
                        type === 'reply' ?
                            <div className='p-4 mt-4 rounded-md bg-grey'>
                                <p>{replied_on_comment?.comment}</p>
                            </div>
                            : <Link href={`/blog/${blog_id}`} className='font-medium text-dark-grey hover:underline line-clamp-1 block mt-1'>{`"${title}"`}</Link>
                    }
                </div>
            </div>

            {
                type !== 'like' && <p className='ml-14 pl-5  font-gelasio text-xl my-5'>{comment.comment}</p>
            }

            <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
                <p>{formatDate(createdAt)}</p>
                {
                    type !== 'like' && (
                        <>
                            <button onClick={handleReplyCLik} className='underline hover:text-black'>Reply</button>
                            <button className='underline hover:text-black'>Delete</button>
                        </>
                    )
                }
            </div>

            {
                isReplying && (
                    <div className='mt-8'>
                        <NotiCardCommentField
                            replyingTo={comment._id}
                            setReplyingFalse={() => setIsReplying(false)}
                            blogId={blogId}
                            notificationId={notificationId}
                            blog_author={user}
                            index={index}
                        />
                    </div>
                )
            }
        </div >
    )
}
