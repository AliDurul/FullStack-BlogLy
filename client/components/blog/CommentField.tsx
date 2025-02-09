'use client';

import { authCredential } from '@/lib/actions/authActions';
import { createComment, likeBLog, revalidateFn } from '@/lib/actions/blogActions';
import { ISingleBlog } from '@/types/blogTypes';
import { useSession } from 'next-auth/react';
import React, { useActionState, useEffect, useState } from 'react'
import { useCommentsContext } from './CommentsContainer';

interface ICommentFieldProps {
    blog: ISingleBlog,
    actionType: string
    action: (formData: FormData) => void
    state: any
    isPending: boolean
}

// export default function CommentField({ actionType, blog, action, state, isPending }: ICommentFieldProps) {
export default function CommentField({ actionType, index = undefined, replyingTo = undefined }: { actionType: string, index?: number, replyingTo?: string }) {
    const { action, state, blog, isPending } = useCommentsContext()

    const [comment, setComment] = useState('')

    const handelAction = async (formData: FormData) => {
        action(formData)

        revalidateFn('Blog')
        // revalidateFn('Comments')
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
                state?.errors && state.errors?.comment && <p className='text-red  pt-1 text-sm '>{state.errors?.comment}</p>
            }
            <button disabled={isPending} type='submit' className='btn-dark mt-5 px-10'>
                {isPending ? 'Sending...' : actionType}
            </button>
        </form>
    )
}
