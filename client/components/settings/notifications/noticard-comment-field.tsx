import { createComment } from '@/lib/actions/blogActions'
import { NotiUser } from '@/types/notiTypes'
import React, { useActionState, useEffect, useState } from 'react'

interface INotiCardCommentFieldProps {
    replyingTo: string,
    setReplyingFalse: () => void,
    blogId: string,
    notificationId: string,
    blog_author: NotiUser,
    index: number,
    refetchNotifications: () => void
}

export default function NotiCardCommentField({ replyingTo, setReplyingFalse, blogId, notificationId, blog_author, index, refetchNotifications }: INotiCardCommentFieldProps) {

    const [comment, setComment] = useState('')

    const [state, action, isPending] = useActionState(createComment, null)

    useEffect(() => {
        if (state?.success) {
            setComment('')
            setReplyingFalse()
            refetchNotifications()
        }
    }, [state, setReplyingFalse, refetchNotifications])

    return (
        <form action={action}>
            <input type="hidden" name='replying_to' value={replyingTo} />
            <input type="hidden" name="_id" value={blogId} />
            <input type="hidden" name="blog_author" value={blog_author._id} />
            <input type="hidden" name="notification_id" value={notificationId} />
            <textarea
                disabled={isPending}
                name="comment"
                id="comment"
                placeholder='Leave a reply...'
                className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
                onChange={(e) => setComment(e.target.value)}
                value={comment}
            >
                {comment}
            </textarea>
            <button disabled={isPending} type='submit' className='btn-dark mt-5 px-10'>
                {isPending ? 'Replying...' : 'Reply'}
            </button>
        </form>
    )
}
