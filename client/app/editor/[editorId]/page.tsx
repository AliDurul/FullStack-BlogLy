import BlogEditorForm from '@/components/editor/BlogEditorForm'
import EditorNav from '@/components/editor/EditorNav'
import AnimationWrapper from '@/components/shared/AnimationWrapper'
import { fetchBlog } from '@/lib/actions/blogActions';
import React from 'react'

export default async function EditBlogPage({ params }: { params: Promise<{ editorId: string }> }) {
    const { editorId } = await params;

    const blog = await fetchBlog(editorId, 'edit');

    if('message' in blog) return <div>{blog.message}</div>

    return (
        <>
            <EditorNav />

            <AnimationWrapper>
                <BlogEditorForm editableBlog={blog.result} />
            </AnimationWrapper>

        </>
    )
}
