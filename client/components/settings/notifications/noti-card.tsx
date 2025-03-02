import { formatDate, getFullDay } from '@/lib/utils'
import { INoti } from '@/types/notiTypes'
import Image from 'next/image'
import Link from 'next/link'
import React, { startTransition, useActionState, useState, useTransition } from 'react'
import NotiCardCommentField from './noticard-comment-field'
import { createComment, deleteComment } from '@/lib/actions/blogActions'
import { useSession } from 'next-auth/react'

export default function NotiCard({ notification, index, refetchNotifications }: { notification: INoti, index: number, refetchNotifications: () => void }) {

    const [isReplying, setIsReplying] = useState(false)

    const { _id: notificationId,seen, reply, createdAt, comment, replied_on_comment, type, user, user: { personal_info: { profile_img, fullname, username } }, blog: { blog_id, title, _id: blogId } } = notification
    const { data: session } = useSession()


    const handleReplyClick = () => {
        setIsReplying(prev => !prev)
    }


    // delete comment or reply
    const [state, action, isPending] = useActionState(deleteComment, null)

    const handleDeleteClick = (comment_id: string, type: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        startTransition(() => {
            action(comment_id)
        });

        refetchNotifications()
    }

    return (
        <div className={`p-6 border-b border-grey border-l-black ${!seen && 'border-l-2'} `}>
            <div className='flex gap-5 mb-3'>
                <Image
                    src={profile_img || '/assets/images/404.png'}
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
                            {
                                !reply && <button onClick={handleReplyClick} className='underline hover:text-black'>Reply</button>
                            }
                            <button disabled={isPending} onClick={(e) => handleDeleteClick(comment._id, 'comment', e)} className='underline hover:text-black'>Delete</button>
                        </>
                    )
                }
            </div>

            {
                isReplying && (
                    <div className='mt-8'>
                        <NotiCardCommentField
                            refetchNotifications={refetchNotifications}
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
            {
                (reply && !isPending) && (
                    <div className='ml-20 p-5 bg-grey mt-5 rounded-md'>
                        <div className="flex gap-3 mb-3">
                            <Image src={session?.user.profile_img || '/assets/images/404.png'} alt={session?.user.fullname || 'author profile'} width={40} height={40} className='rounded-full flex-none size-8' />
                            <div className='font-medium text-xl text-dark-grey'>
                                <Link className=' mx-1 text-black underline' href={`/user/${session?.user.username}`}>
                                    @{session?.user.username}
                                </Link>
                                <span className='font-normal'>replied to</span>
                                <Link className='mx-1 text-black underline' href={`/user/${username}}`}>
                                    @{username}
                                </Link>
                            </div>
                        </div>
                        <p className='ml-14 font-gelasio text-xl my-2'>{reply.comment}</p>
                        <button disabled={isPending} onClick={(e) => handleDeleteClick(reply._id, 'reply', e)} className='underline hover:text-black ml-14 mt-2'>Delete</button>
                    </div>
                )
            }
            {
                isPending && <div className='ml-20 p-5 bg-grey mt-5 rounded-md'>Deleting...</div>
            }


        </div >
    )
}
