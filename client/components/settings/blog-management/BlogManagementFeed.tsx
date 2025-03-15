'use client';

import InPageNavigation from '@/components/auth/InPageNavigation';
import BlogCard from '@/components/root/BlogCard';
import NoDataFound from '@/components/root/NoDataFound';
import AnimationWrapper from '@/components/shared/AnimationWrapper';
import Loader from '@/components/shared/Loader';
import { fetchBlogs } from '@/lib/actions/blogActions';
import { useInfiniteQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer'
import { DraftBlogsCard, PublishedBlogCard } from './BlogManagementCards';


export default function BlogManagementFeed({ author }: { author?: string }) {

    const { ref, inView } = useInView();
    const router = useRouter()
    const pathname = usePathname()

    const [blogs, setBlogs] = useState<any[]>([])
    const searchParams = useSearchParams();
    const search = searchParams.get('search') || '';
    const draft = searchParams.get('draft') || 'false';

    // console.log(search,'search');


    const { data, error, status, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } = useInfiniteQuery({
        queryKey: ['own-posts', search, draft],
        queryFn: ({ pageParam }) => fetchBlogs({ pageParam, author, draft, search }),
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            if (!lastPage?.details?.next) return null
            return lastPage?.details?.next
        },
        enabled: !!draft
    });

    // useEffect(() => {
    //     if (data?.pages) {
    //         setBlogs(data.pages);
    //     }
    // }, [data]);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    );


    if (error) return <NoDataFound message='Failed to load blogs 😞' />


    return (
        <>
            <div className='flex items-center gap-4 mb-8 duration-200'>
                <button
                    onClick={() => {
                        router.push(pathname + '?' + createQueryString('draft', 'false'))
                    }}
                    className={`p-4 px-5 capitalize ${draft === 'false' && 'border-b'}`}>
                    Published Blogs
                </button>
                <button
                    onClick={() => {
                        router.push(pathname + '?' + createQueryString('draft', 'true'))
                    }}
                    className={`p-4 px-5 capitalize ${draft === 'true' && 'border-b'}`}>
                    Drafts
                </button>
            </div>

            {
                status === 'pending' ? <Loader /> : (
                    data?.pages.map((page: any, i: number) => {
                        return (
                            <div key={i}>
                                {
                                    page.result.length ? (
                                        page?.result.map((blog: any, i: number) => {
                                            return (
                                                <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>

                                                    {
                                                        draft === 'false' ? <PublishedBlogCard blog={blog} refetch={refetch} /> : <DraftBlogsCard refetch={refetch} blog={blog} index={i + 1} />
                                                    }

                                                </AnimationWrapper>
                                            )
                                        })
                                    ) : (<NoDataFound message='No Blogs Published 😱' />)
                                }
                            </div>
                        )
                    })
                )
            }


            {/* <div ref={ref} /> */}
            {
                isFetchingNextPage && <Loader />
            }
            {
                hasNextPage && (
                    <button
                        disabled={!hasNextPage}
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
