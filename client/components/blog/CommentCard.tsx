import { formatDate, getFullDay } from '@/lib/utils'
import { IComment, IPersonalInfo } from '@/types/blogTypes'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'
import CommentField from './CommentField'
import { useCommentsContext } from './CommentsContainer'

interface ICommentCardProps {
    commentData: IComment & { childrenLevel: number, isReplyLoaded: boolean },
    index: number,
}

export default function CommentCard({ commentData, index }: ICommentCardProps) {
    const session = useSession()
    const { _id, comment, commentedAt, commented_by: { personal_info: { profile_img, fullname, username } }, children, childrenLevel, isReplyLoaded } = commentData
    const { replyingTo, setReplyingTo } = useCommentsContext()

    const [showReplies, setShowReplies] = useState(false)

    const handleHideReply = () => {
        setShowReplies(!showReplies)
        // 
    }

    const handleReplyClick = () => {
        setReplyingTo(replyingTo === commentData._id ? null : commentData._id)
    }

    return (
        <div className='w-full' >
            <div className='my-5 p-6 rounded-md border border-grey'>
                <div className='flex gap-3 items-center mb-8'>
                    <Image
                        src={profile_img}
                        alt={fullname}
                        className='rounded-full size-6'
                        height={40}
                        width={40}
                    />
                    <p className='line-clamp-1'>
                        <span className='text-dark-grey opacity-75'>{fullname}</span>
                        <span className='font-semibold text-black'> @{username}</span>
                    </p>
                    <p className='min-w-fit'>{formatDate(commentedAt)}</p>
                </div>
                <p className='font-gelasio text-xl ml-3'>{comment}</p>
                <div className='flex gap-5 items-center mt-5'>
                    {
                        children.length > 0 && (
                            <button onClick={handleHideReply} className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>
                                <i className='fi fi-rr-comment-dots' />
                                {showReplies ? 'Hide Reply' : 'Show Reply'}
                            </button>
                        )
                    }
                    <button className='text-dark-grey font-serif underline' onClick={handleReplyClick}>Reply</button>
                </div>
                {
                    replyingTo === commentData._id && (
                        <div className='mt-8'>
                            <CommentField actionType='reply' index={index} replyingTo={_id} />
                        </div>
                    )
                }
                {
                    showReplies && children.map((childComment, i) => (
                        <CommentCard key={i} commentData={childComment} index={i} />
                    ))
                }
            </div>
        </div>
    )
}
