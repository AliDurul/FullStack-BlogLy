'use client';

import { fetchLatestBlogs } from '@/lib/actions/blogActions';
import { LatestBlogResult, TLatestBlogResponse } from '@/types';
import React, { useEffect, useState } from 'react'
import BlogCard from '../BlogCard';
import AnimationWrapper from '../shared/AnimationWrapper';
import NoDataFound from './NoDataFound';
import LoadMoreBtn from './LoadMoreBtn';
import { useSearchParams } from 'next/navigation';

export default function LatestBlogs({ category, query, page }: { category: string, query: string, page: string }) {

    const searParams = useSearchParams();
    const categoryy = searParams.get('category') || '';

    const [latestBlogs, setLatestBlogs] = useState<TLatestBlogResponse>({ details: { totalRecords: 0, previous: false, current: 0, next: 0, total: 0 }, success: false, result: [] });

    const fecthBlogsFnc = async () => {
        console.log('fetching blogs');
        const res = await fetchLatestBlogs({ category, query, page });
        setLatestBlogs(res);
    }

    useEffect(() => {

        fecthBlogsFnc();

    }, [categoryy])


    // const latestBlogs: TLatestBlogResponse = await fetchLatestBlogs({ category, query, page });

    return (
        <>
            {
                // latestBlogs?.result.length ? (
                    latestBlogs.result.map((blog: LatestBlogResult, i: number) => {
                        return (
                            <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                <BlogCard blog={blog} author={blog.author.personal_info} />
                            </AnimationWrapper>
                        )
                    })
                // ) : (<NoDataFound message='No Blogs Published 😱' />)
            }
            <LoadMoreBtn state={latestBlogs} />
        </>
    )
}
