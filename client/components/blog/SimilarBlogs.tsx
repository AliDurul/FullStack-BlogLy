import { fetchBlogs } from '@/lib/actions/blogActions';
import React from 'react'
import AnimationWrapper from '../shared/AnimationWrapper';
import BlogCard from '../root/BlogCard';

export default async function SimilarBlogs({ blog_id, tags }: { blog_id: string, tags: string[] }) {
    const similarBlogs = await fetchBlogs({ category: tags[0], search: '', pageParam: '', author: '', limit: '3', excludedId: blog_id });

    if ('message' in similarBlogs) return <h1>Something went wrong</h1>
    
    return (
        <>
            {
                similarBlogs.result.length > 0 && (
                    <>
                        <h1 className='text-2xl mt-14 mb-10 font-medium'> Similar Blogs</h1>
                        {
                            similarBlogs.result.map((blog, i) => (
                                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }} >
                                    <BlogCard blog={blog} author={blog?.author.personal_info} />
                                </AnimationWrapper>
                            ))
                        }
                    </>
                )
            }
        </>
    )
}
