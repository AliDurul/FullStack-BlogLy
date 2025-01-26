import { fetchTrendingBlogs } from '@/lib/actions/blogActions';
import { TTrendingBlog, TTrendingBlogResponse } from '@/types';
import React from 'react'
import AnimationWrapper from '../shared/AnimationWrapper';
import MinimalBlogCard from './MinimalBlogCard';
import NoDataFound from './NoDataFound';
import { fetchUsers } from '@/lib/actions/userActions';
import Image from 'next/image';
import Link from 'next/link';
import MiniUserCard from './MiniUserCard';

export default async function TrendingBlogs({ search }: { search: string }) {

  if (!search) {
    const trendingBlogs: TTrendingBlogResponse = await fetchTrendingBlogs();


    return (
      <>
        {
          trendingBlogs?.result?.length ? (
            trendingBlogs?.result?.map((blog: TTrendingBlog, i: number) => {
              return (
                <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                  <MinimalBlogCard blog={blog} index={i} />
                </AnimationWrapper>
              )
            })) : (<NoDataFound message='No Any Trending Blog 😱' />)
        }
      </>
    )
  } else {
    const users = await fetchUsers({ username: search });

    return (
      <>
        {
          users?.result?.length ? (
            users?.result?.map((user: any, i: number) => {
              return (
                <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                 <MiniUserCard user={user} />
                </AnimationWrapper>
              )
            })) : (<NoDataFound message='No Any Trending Blog 😱' />)
        }
      </>
    )
  }
}
