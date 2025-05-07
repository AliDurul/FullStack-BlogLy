import { fetchTrendingBlogs } from '@/lib/actions/blogActions';
import React from 'react'
import AnimationWrapper from '../shared/AnimationWrapper';
import MinimalBlogCard from './MinimalBlogCard';
import NoDataFound from './NoDataFound';
import { fetchUsers } from '@/lib/actions/userActions';
import MiniUserCard from './MiniUserCard';
import { ITrendingBlog } from '@/types/blogTypes';

export default async function TrendingBlogs({ search }: { search: string }) {

  if (!search) {
    const trendingBlogs = await fetchTrendingBlogs();

    if (('message' in trendingBlogs)) {
      return <NoDataFound message={trendingBlogs.message + '⛑️'} />
    }

    return (
      <>
        {
          trendingBlogs?.result?.length ? (
            trendingBlogs?.result?.map((blog: ITrendingBlog, i: number) => {
              return (
                <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                  <MinimalBlogCard blog={blog} index={i} />
                </AnimationWrapper>
              )
            })) : (<NoDataFound message='No Any Trending Blog 😱' />)
        }
      </>
    );

  } else {
    const users = await fetchUsers(search);

    if (('message' in users)) {
      return <NoDataFound message={users.message + '⛑️'} />
    }

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
            })) : (<NoDataFound message='No any user found with this name ⛑️ ' />)
        }
      </>
    )
  }
}
