import { fetchTrendingBlogs } from '@/lib/actions/blogActions';
import { TTrendingBlog, TTrendingBlogResponse } from '@/types';
import React from 'react'
import AnimationWrapper from '../shared/AnimationWrapper';
import MinimalBlogCard from './MinimalBlogCard';

export default async function TrendingBlogs() {

  const trendingBlogs: TTrendingBlogResponse = await fetchTrendingBlogs();

  return (
    <>
      {
        trendingBlogs.result.map((blog: TTrendingBlog, i: number) => {
          return (
            <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
              <MinimalBlogCard blog={blog} index={i} />
            </AnimationWrapper>
          )
        })
      }
    </>
  )
}
