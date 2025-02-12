import { formatDate, getFullDay } from '@/lib/utils'
import { IComment, IPersonalInfo } from '@/types/blogTypes'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { startTransition, useActionState, useEffect, useState } from 'react'
import CommentField from './CommentField'
import { useCommentsContext } from './CommentsContainer'
import { useQuery } from '@tanstack/react-query'
import { deleteComment, fetchRepliesOfComment, revalidateFn } from '@/lib/actions/blogActions'
import Loader from '../shared/Loader'

interface ICommentCardProps {
    commentData: IComment & { childrenLevel: number, isReplyLoaded: boolean },
    index: number,
}

export default function CommentCard({ commentData, index }: ICommentCardProps) {
    const session = useSession()


    const { replyingTo, setReplyingTo, blog, setCustomizedCommentsArr, setOpen } = useCommentsContext()
    const [showReplies, setShowReplies] = useState(false)
    const [fetchReplies, setFetchReplies] = useState(false);

    const { _id, comment, commentedAt, commented_by: { personal_info: { profile_img, fullname, username: comment_author } }, children } = commentData
    const { author: { personal_info: { username: blog_author } } } = blog


    const handleHideReply = () => {
        setShowReplies(!showReplies)
        if (!showReplies) {
            setFetchReplies(true);
        }
    }

    const [state, action, isPending] = useActionState(deleteComment, null)

    const { data: commentReplies, error, status: fetchingRepylStatus } = useQuery({
        queryKey: ['commentReplies', _id],
        queryFn: () => fetchRepliesOfComment(_id),
        enabled: fetchReplies
    });



    const handleDeleteComment = () => {
        startTransition(() => {
            action(_id)
        });
    };

    const removeComment = (comments: IComment[], commentId: string): IComment[] => {
        return comments.filter(comment => {
            if (comment._id === commentId) {
                return false;
            }
            if (comment.children.length > 0) {
                comment.children = removeComment(comment.children, commentId);
            }
            return true;
        });
    };

    useEffect(() => {
        if (state?.success) {
            setCustomizedCommentsArr(prev => {
                const newCommentsArr = prev.map(page => ({
                    ...page,
                    result: removeComment(page.result, _id)
                }));
                return [...newCommentsArr];
            });
            revalidateFn('Blog')
            setOpen(false)
            setReplyingTo(null);
        }
    }, [state]);



    useEffect(() => {
        if (!showReplies) {
            setFetchReplies(false);
        }
    }, [showReplies]);

    const handleReplyClick = () => {
        setReplyingTo(replyingTo === commentData._id ? null : commentData._id)
    }



    return (
        <div className='w-full' >

            {
                isPending ?
                    <Loader />
                    : (
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
                                    <span className='font-semibold text-black'> @{comment_author}</span>
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
                                {
                                    (session.data?.user?.username === blog_author || session.data?.user?.username === comment_author) && (
                                        <button
                                            disabled={isPending}
                                            className='p-1 px-2 rounded-md border-grey ml-auto hover:text-red hover:bg-red/30  flex items-center'
                                            onClick={handleDeleteComment}>
                                            <i className='fi fi-rr-trash' />
                                        </button>
                                    )
                                }
                            </div>
                            {
                                replyingTo === commentData._id && (
                                    <div className='mt-8'>
                                        <CommentField actionType='reply' index={index} replyingTo={_id} />
                                    </div>
                                )
                            }
                            {
                                showReplies && (
                                    fetchingRepylStatus === 'pending' ? (
                                        <Loader />
                                    ) : (
                                        commentReplies?.result?.map((childComment: any, i: any) => (
                                            <CommentCard key={i} commentData={childComment} index={i} />
                                        ))
                                    )
                                )
                            }
                        </div>
                    )
            }

        </div>
    )
}
