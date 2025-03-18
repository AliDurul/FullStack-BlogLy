'use client';

import { fetchBlogs } from '@/lib/actions/blogActions';
import BlogCard from './BlogCard';
import AnimationWrapper from '../shared/AnimationWrapper';
import NoDataFound from './NoDataFound';
import { useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import Loader from '../shared/Loader';
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react';

export default function Blogs({ author }: { author?: string }) {

    const searchParams = useSearchParams();
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    const { ref, inView } = useInView();

    const { data, error, status, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } = useInfiniteQuery({
        queryKey: ['posts', category, search],
        queryFn: ({ pageParam }) => fetchBlogs({ category, search, pageParam, author }),
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            if (!lastPage?.details?.next) return null
            return lastPage?.details?.next
        },
        // enabled: true,
    });

    // console.log(data, error, status);

    // infinity scroll data fetching
    // useEffect(() => {
    //     if (inView) {
    //         fetchNextPage()
    //     }
    // }, [fetchNextPage, inView])


    useEffect(() => {
        refetch(); // Re-fetch when params change
    }, [category, search, refetch]);

    if (status === 'pending') return <Loader />
    if (error) return <NoDataFound message='Failed to load blogs 😞' />

    return (
        <>
            {
                data?.pages.map((page: any, i: number) => {
                    return (
                        <div key={i}>
                            {
                                page.result.length ? (
                                    page?.result.map((blog: any, i: number) => {
                                        return (
                                            <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                <BlogCard blog={blog} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        )
                                    })
                                ) : (<NoDataFound message='No Blogs Published 😱' />)
                            }
                        </div>
                    )
                })
            }
            <div ref={ref} />
            {
                isFetchingNextPage && <Loader />
            }
            {
                hasNextPage && (
                    <button
                        disabled={!hasNextPage || isFetchingNextPage}
                        className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                        onClick={() => fetchNextPage()}
                    >
                        Load More
                    </button>
                )
            }
        </>
    )
}
