import { createComment } from '@/lib/actions/blogActions'
import { NotiUser } from '@/types/notiTypes'
import React, { useActionState, useEffect, useState } from 'react'

interface INotiCardCommentFieldProps {
    replyingTo: string,
    setReplyingFalse: () => void,
    blogId: string,
    notificationId: string,
    blog_author: NotiUser
    index: number
}

export default function NotiCardCommentField({ replyingTo, setReplyingFalse, blogId, notificationId, blog_author, index }: INotiCardCommentFieldProps) {

    const [comment, setComment] = useState('')

    const [state, action, isPending] = useActionState(createComment, null)

    // useEffect(() => {

    //     if(state?.success && state?.result)
    //     console.log('state-- ', state);
    //     setReplyingFalse()
    // }, [state])



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

{/* <form action={handelAction}>
{
    replyingTo && <input type="hidden" name='replying_to' value={replyingTo} />
}
<input type="hidden" name="_id" value={blog._id} />
<input type="hidden" name="blog_author" value={blog.author._id} />
<textarea
    disabled={isPending}
    name="comment"
    id="comment"
    placeholder='Leave a comment...'
    className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
    onChange={(e) => setComment(e.target.value)}
    value={comment}
>
    {comment}
</textarea>
{
    createCommentState?.errors && createCommentState.errors?.comment && <p className='text-red  pt-1 text-sm '>{createCommentState.errors?.comment}</p>
}
<button disabled={isPending} type='submit' className='btn-dark mt-5 px-10'>
    {isPending ? 'Sending...' : actionType}
</button>
</form> */}