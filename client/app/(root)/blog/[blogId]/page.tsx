import BlogContent from '@/components/blog/BlogContent';
import BlogInteractions from '@/components/blog/BlogInteractions';
import SimilarBlogs from '@/components/blog/SimilarBlogs';
import AnimationWrapper from '@/components/shared/AnimationWrapper';
import Loader from '@/components/shared/Loader';
import { fetchBlog } from '@/lib/actions/blogActions';
import { formatDate, getFullDay } from '@/lib/utils';
import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense } from 'react'


type Props = {
    params: Promise<{ blogId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const id = (await params).blogId

    const blog = await fetchBlog(id)

    if ('message' in blog) {
        return {
            title: 'Blog Not Found',
            description: 'The blog you are looking for does not exist.',
            robots: 'noindex, nofollow',
        };
    };

    return {
        title: blog.result.title,
        description: blog.result.des,
        keywords: blog.result.tags.join(', '),
        openGraph: {
            title: blog.result.title,
            description: blog.result.des,
            url: `https://blogly.vercel.app/blog/${blog.result.blog_id}`,
            images: [
                {
                    url: blog.result.banner,
                    width: 800,
                    height: 600,
                },
            ],
            type: 'article',
            siteName: 'BlogLy',
        },
        
        robots: 'index, follow',
    };
};

export default async function DetailBlogPage({ params }: { params: Promise<{ blogId: string }> }) {
    const { blogId } = await params;

    const blog = await fetchBlog(blogId);

    if ('message' in blog) return <h1>Something went wrong</h1>

    const { title, blog_id, content, tags, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog.result;


    return (
        <AnimationWrapper>
            <div className='max-w-[900px] center py-10 max-lg:px-[5vw] relative'>

                <Image src={banner} alt={title} width={900} height={500} className='rounded-lg aspect-video' />

                <div className="mt-8 md:mt-12">
                    <h2>{title}</h2>
                    {/* Blog Tags */}
                    <div className='flex gap-3 mt-2 flex-wrap max-sm:justify-center max-sm:items-center'>
                        {
                            tags.map((tag, i) => {
                                return (
                                    <span key={i} className='btn-light py-1 px-4 text-sm md:text-base'>
                                        {tag}
                                    </span>
                                )
                            })
                        }
                    </div>
                    <div className="flex max-sm:flex-col justify-between mb-6 mt-4">
                        <div className='flex gap-5 items-start'>
                            <Image src={profile_img} alt={fullname} width={50} height={50} className='rounded-full size-12' />
                            <p className='capitalize'>
                                {fullname}
                                <br />
                                <Link className='font-semibold underline' href={`/user/${author_username}`}>@{author_username}</Link>
                            </p>
                        </div>
                        <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5 text-sm md:text-base'>
                            Published on {getFullDay(publishedAt)}
                        </p>
                    </div>
                </div>

                <BlogInteractions blog={blog.result} />
                {/* Blog Content */}
                <div className='font-gelasio blog-page-content'>
                    {
                        content.map((block, i) => {
                            return (
                                <div key={i} className='my-4 md:my-8'>
                                    <BlogContent block={block} />
                                </div>
                            )
                        })
                    }
                </div>


                {/* Similar Posts */}
                <Suspense fallback={<Loader />}>
                    <SimilarBlogs blog_id={blog_id} tags={tags} />
                </Suspense>
            </div>
        </AnimationWrapper >
    )



}
