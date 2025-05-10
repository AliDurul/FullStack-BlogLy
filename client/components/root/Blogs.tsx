import { fetchBlogs } from '@/lib/actions/blogActions';
import BlogCard from './BlogCard';
import AnimationWrapper from '../shared/AnimationWrapper';
import NoDataFound from './NoDataFound';

interface IBlogsParams {
    category?: string,
    search?: string,
    pageParam?: number,
    author?: string
}

export default async function Blogs({ author, category, search, pageParam = 1 }: IBlogsParams) {


    const blogs = await fetchBlogs({ category, search, pageParam, author });

    const queryMessage = search ? ` Search Results for "${search}"` : category ? ` Blogs in ${category}` : ' ';

    if ('message' in blogs) {
        return <NoDataFound message={blogs.message + queryMessage +'⛑️'} />
    }


    return (
        <>
            {
                blogs.result?.length ? (
                    blogs?.result.map((blog: any, i: number) => {
                        return (
                            <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                <BlogCard blog={blog} author={blog.author.personal_info} />
                            </AnimationWrapper>
                        )
                    })
                ) : (<NoDataFound message='No Blogs Published 😱' />)
            }
        </>
    )
}
