import { fetchLatestBlogs } from '@/lib/actions/blogActions';
import { LatestBlogResult, TLatestBlogResponse } from '@/types';
import React from 'react'
import BlogCard from '../BlogCard';
import AnimationWrapper from '../shared/AnimationWrapper';

export default async function LatestBlogs({ category, query }: { category: string, query: string }) {

    


    const latestBlogs: TLatestBlogResponse = await fetchLatestBlogs({ category, query });

    return (
        <>
            {
                latestBlogs.result.map((blog: LatestBlogResult, i: number) => {
                    return (
                        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                            <BlogCard blog={blog} author={blog.author.personal_info} />
                        </AnimationWrapper>
                    )
                })
            }
        </>
    )
}
