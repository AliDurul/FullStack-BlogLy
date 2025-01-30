import BlogInteractions from '@/components/blog/BlogInteractions';
import AnimationWrapper from '@/components/shared/AnimationWrapper';
import { fetchBlog } from '@/lib/actions/blogActions';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function DetailBlogPage({ params }: { params: Promise<{ blogId: string }> }) {
    const { blogId } = await params;

    const blog = await fetchBlog(blogId);

    if (!blog.success) {
        return <h1>Something went wrong</h1>
    }

    if ('result' in blog) {
        const { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog.result

        return (
            <AnimationWrapper>
                <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                    <Image src={banner} alt={title} width={900} height={500} className='rounded-lg aspect-video' />

                    <div className="mt-12">
                        <h2>{title}</h2>

                        <div className="flex max-sm:flex-col justify-between my-8">
                            <div className='flex gap-5 items-start'>
                                <Image src={profile_img} alt={fullname} width={50} height={50} className='rounded-full size-12' />
                                <p className='capitalize'>
                                    {fullname}
                                    <br />
                                    @
                                    <Link className='underline' href={`/user/${author_username}`}>{author_username}</Link>
                                </p>
                            </div>
                            <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published on {formatDate(publishedAt)}</p>
                        </div>

                    </div>

                    <BlogInteractions blog={blog.result} />
                </div>
            </AnimationWrapper>
        )


    }

}
