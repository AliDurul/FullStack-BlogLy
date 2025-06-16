
import NoDataFound from '@/components/root/NoDataFound';
import AnimationWrapper from '@/components/shared/AnimationWrapper';
import Loader from '@/components/shared/Loader';
import { fetchBlogs } from '@/lib/actions/blogActions';
import { DraftBlogsCard, PublishedBlogCard } from './BlogManagementCards';
import getSession from "@/lib/utils";
import BlogManagementBtns from './BlogManagementBtns';

type PageProps = { searchParams: { search?: string, pageParam?: number, draft?: string } }

export default async function BlogManagementFeed({ searchParams }: PageProps) {


    const session = await getSession();
    const author = session?.user._id;

    const search = searchParams.search || ''
    const pageParam = parseInt(searchParams.pageParam || '1', 10);
    const draft = searchParams.draft || 'false';

    const blogs = await fetchBlogs({ pageParam, author, draft, search });


    return (
        <>

            <BlogManagementBtns />

            {
                'message' in blogs
                    ? (<NoDataFound message={blogs.message + '⛑️'} />)
                    : blogs?.result?.length ? (
                        blogs?.result.map((blog: any, i: number) => {
                            return (
                                <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>

                                    {
                                        draft === 'false' ? <PublishedBlogCard blog={blog} /> : <DraftBlogsCard blog={blog} index={i + 1} />
                                    }

                                </AnimationWrapper>
                            )
                        })
                    ) : (<NoDataFound message='No Blogs Published 😱' />)
            }

        </>
    )
}
