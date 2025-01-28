import { fetchBlog } from '@/lib/actions/blogActions';
import React from 'react'

export default async function DetailBlogPage({ params }: { params: Promise<{ blogId: string }> }) {
    const { blogId } = await params;

    const blog = await fetchBlog(blogId);

    if ('result' in blog) {
        console.log(blog.result.title);
    }

    return (
        <div>page</div>
    )
}
