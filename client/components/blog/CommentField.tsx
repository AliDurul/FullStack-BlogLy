'use client';

import { revalidateFn } from '@/lib/actions/blogActions';
import React, { useState } from 'react'
import { useCommentsContext } from './CommentsContainer';


interface ICommentFieldProps {
    actionType: string,
    index?: number,
    replyingTo?: string,
}

export default function CommentField({ actionType, index = undefined, replyingTo = undefined, }: ICommentFieldProps) {

    const { action, createCommentState, blog, isPending, setReplyingTo } = useCommentsContext()
    const [comment, setComment] = useState('')

    const handelAction = async (formData: FormData) => {
        action(formData)
        revalidateFn('Blog')
        setComment('')

    }


    return (
        <form action={handelAction}>
            {
                replyingTo && <input type="hidden" name='replying_to' value={replyingTo} />
            }
            <input type="hidden" name="_id" value={blog._id} />
            <input type="hidden" name="blog_author" value={blog.author._id} />
            <textarea
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
        </form>
    )
}
