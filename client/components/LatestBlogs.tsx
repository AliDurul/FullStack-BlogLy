import { fetchLatestBlogs } from '@/lib/actions/blogActions';
import { LatestBlogResult, TLatestBlog } from '@/types';
import React from 'react'

export default async function LatestBlogs() {
    const latestBlogs: TLatestBlog = await fetchLatestBlogs();

    return (
        <div>
            {
                latestBlogs.result.map((blog: LatestBlogResult, i: number) => {
                    return (
                        <div key={i} className="flex flex-col gap-4">
                            <h1>{blog.title}</h1>
                            <p>{blog.des}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}
