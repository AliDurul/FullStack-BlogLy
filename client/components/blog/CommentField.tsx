'use client';

import { authCredential } from '@/lib/actions/authActions';
import { createComment, likeBLog, revalidateFn } from '@/lib/actions/blogActions';
import { ISingleBlog } from '@/types/blogTypes';
import { useSession } from 'next-auth/react';
import React, { useActionState, useEffect, useState } from 'react'

export default function CommentField({ actionType, blog }: { actionType: string, blog: ISingleBlog }) {

    const [comment, setComment] = useState('')

    const [state, action, isPending] = useActionState(createComment, null)
    console.log(state);

    // useEffect(() => {
   
    // }, [state])
    

    const handelAction = async (formData: FormData) => {
        action(formData)

        revalidateFn('Blog')
        setComment('')
    }

    return (
        <form action={handelAction}>
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
