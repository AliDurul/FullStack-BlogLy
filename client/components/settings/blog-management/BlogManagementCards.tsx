'use client';
import Loader from '@/components/shared/Loader'
import { deleteBlog } from '@/lib/actions/blogActions'
import { revalidateTagFn } from '@/lib/actions/revalidateActions'
import { formatDate } from '@/lib/utils'
import { IActivity, IPersonalInfo, ISingleBlog } from '@/types/blogTypes'
import Image from 'next/image'
import Link from 'next/link'
import React, { startTransition, useActionState, useEffect, useState } from 'react'


const BlogStats = ({ stats }: { stats: IActivity }) => {
    return (
        <div className='flex gap-2 max-lg:pt-4 '>
            <div className='flex flex-col items-center w-full h-full justify-center p-4 px-6'>
                <h1 className='text-xl lg:text-2xl mb-2'>{stats?.likes?.length?.toLocaleString()}</h1>
                <p className='max-lg:text-dark-grey capitalize'>likes</p>
            </div>
            <div className='flex flex-col items-center w-full h-full justify-center p-4 px-6 border-grey border-l'>
                <h1 className='text-xl lg:text-2xl mb-2'>{stats?.comments.length || 0}</h1>
                <p className='max-lg:text-dark-grey capitalize'>comments</p>
            </div>
            <div className='flex flex-col items-center w-full h-full justify-center p-4 px-6 border-grey border-l'>
                <h1 className='text-xl lg:text-2xl mb-2'>{stats?.total_reads?.toLocaleString()}</h1>
                <p className='max-lg:text-dark-grey capitalize'>reads</p>
            </div>
        </div>
    )
};

interface IBlogActionProps { blog: ISingleBlog, action: (id: string) => void, state: any, isPending: boolean }

const BlogActions = ({ blog, action, state, isPending }: IBlogActionProps) => {

    const handleDelete = () => {
        startTransition(() => {
            action(blog.blog_id)
        });
    };

    // useEffect(() => {
    //     if (state?.success) {
    //         refetch()
    //     }
    // }, [state]);

    return (
        <>
            <Link href={`/editor/${blog.blog_id}`} className='pr-4 py-2 underline hover:text-primary'>Edit</Link>
            <button disabled={isPending} onClick={handleDelete} className='pr-4 p-2 underline text-red'>Delete</button>
        </>
    )
};

export function PublishedBlogCard({ blog }: { blog: ISingleBlog }) {

    const [showStat, setShowStat] = useState(false)
    const [state, action, isPending] = useActionState(deleteBlog, null)

    return (
        <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>
            {
                isPending ? <Loader /> : (
                    <>
                        <Image
                            src={blog?.banner}
                            alt={blog?.title}
                            width={112} height={112}
                            className='max-md:hidden lg:hidden xl:block size-28 flex-none bg-grey object-cover' />

                        <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
                            <div>
                                <Link href={`/blog/${blog.blog_id}`} className='blog-title mb-4 hover:underline'>{blog.title}</Link>
                                <p className='line-clamp-1'>Published on {formatDate(blog.publishedAt)}</p>
                            </div>
                            <div className='flex gap-6 mt-3'>
                                <BlogActions blog={blog} action={action} state={state} isPending={isPending} />
                                <button className='lg:hidden pr-4 p-2 underline' onClick={() => setShowStat(prev => !prev)}>Stats</button>
                            </div>

                            {
                                showStat && <div className='lg:hidden'><BlogStats stats={blog?.activity} /></div>
                            }
                        </div>
                        <div className='max-lg:hidden'>
                            <BlogStats stats={blog.activity} />
                        </div>
                    </>
                )
            }


        </div>
    )
}


export function DraftBlogsCard({ blog, index }: { blog: ISingleBlog, index: number }) {

    const [state, action, isPending] = useActionState(deleteBlog, null)

    return (
        <div className='flex gap-5 lg:gap-10 pb-10 border-b mb-6 border-grey'>
            {
                isPending ? <Loader /> : (
                    <>
                        <h1 className='blog-index text-center pl-4 md:pl-6 flex-none '>
                            {
                                index < 10 ? '0' + index : index
                            }
                        </h1>
                        <div>
                            <h1 className='blog-title mb-3'> {blog?.title} </h1>
                            <p className='line-clamp-2 font-gelasio'>{blog?.des?.length ? blog?.des : 'No Description'}</p>
                            <div className='flex gap-6 mt-3'>
                                <BlogActions blog={blog} action={action} state={state} isPending={isPending} />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}
