'use client';

import { fetchLatestBlogs } from '@/lib/actions/blogActions';
import { LatestBlogResult, TLatestBlogResponse } from '@/types';
import React, { useEffect, useState } from 'react'
import BlogCard from '../BlogCard';
import AnimationWrapper from '../shared/AnimationWrapper';
import NoDataFound from './NoDataFound';
import { useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import Loader from '../shared/Loader';
import { useInView } from 'react-intersection-observer'

export default function LatestBlogs() {

    const searParams = useSearchParams();
    const category = searParams.get('category') || '';
    const query = searParams.get('query') || '';
    const page = (searParams.get('page') || 1) as string

    const { ref, inView } = useInView();



    const { data, error, status, fetchNextPage, isFetchingNextPage, hasNextPage, } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: ({ pageParam }) => fetchLatestBlogs({ category, query, pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage?.details?.next) return null
            return lastPage?.details?.next
        },
    }
    );

    // infinity scroll data fetching
    // useEffect(() => {
    //     if (inView) {
    //         fetchNextPage()
    //     }
    // }, [fetchNextPage, inView])



    if (status === 'pending') return <Loader />


    return (
        <>
            {
                // latestBlogs?.result.length ? (
                data?.pages.map((page: any, i: number) => {
                    return (
                        <div key={i}>
                            {page.result.map((blog: any, i: number) => {
                                return (
                                    <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                        <BlogCard blog={blog} author={blog.author.personal_info} />
                                    </AnimationWrapper>
                                )
                            })}
                        </div>
                    )
                })
                // ) : (<NoDataFound message='No Blogs Published 😱' />)
            }
            <div ref={ref} />
            {
                isFetchingNextPage && <Loader />
            }

            <button
                disabled={!hasNextPage}
                className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                onClick={() => fetchNextPage()}
            >
                Load More
            </button>
        </>
    )
}
