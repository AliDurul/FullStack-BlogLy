import InPageNavigation from "@/components/auth/InPageNavigation";
import Loader from "@/components/shared/Loader";
import AnimationWrapper from "@/components/shared/AnimationWrapper";
import { Suspense } from "react";
import TrendingBlogs from "@/components/root/TrendingBlogs";
import { TrendingIcon } from "@/components/icons";
import CategoryBtns from "@/components/root/CategoryBtns";
import Blogs from "@/components/root/Blogs";
import getSession from "@/lib/utils";
import { signIn } from "@/auth";
import BlogsSkeleton from "@/components/root/BlogsSkeleton";
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  // const slug = (await params).slug
  const search = (await searchParams).search || ''
  const category = (await searchParams).category || ''

  // // fetch post information
  // const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
  //   res.json()
  // )

  return {
    title: search ? `Search Results for "${search}"` : category ? `Blogs in ${category}` : 'BlogLy | Modern Blogging Website',
    description: search ? `Search Results for "${search}"` : category ? `Blogs in ${category}` : 'A modern blogging website built with MERN stack.',
  }
}



type HomePageParams = { searchParams: Promise<{ [key: string]: string | undefined }> }

export default async function Home({ searchParams }: HomePageParams) {

  // const session = await getSession();
  const category = (await searchParams).category || ''
  const search = (await searchParams).search || ''
  const pageParam = ((await searchParams).pageParam || 1) as number

  const defaultRoutes = [category === '' ? 'Home' : category, 'trending blogs']
  const defaultHidden = ['trending blogs']
  const searchRoutes = [`Search Results from "${search}"`, "Accounts Matched"]
  const searchHidden = ['Accounts Matched']

  // if (session?.error === "RefreshTokenError") {
  //   await signIn("google") // Force sign in to obtain a new set of access and refresh tokens
  // }
  return (
    <AnimationWrapper >
      <section className="h-cover flex justify-center gap-10">

        {/* latest blogs */}
        <div className="w-full">

          <InPageNavigation routes={search ? searchRoutes : defaultRoutes} defaultHidden={search ? searchHidden : defaultHidden} >

            <Suspense fallback={<BlogsSkeleton />}>
              <Blogs category={category} search={search} pageParam={pageParam} />
            </Suspense>

            <Suspense fallback={<Loader />}>
              <TrendingBlogs search={search} />
            </Suspense>

          </InPageNavigation>

        </div>

        {/*  filters and trending blogs*/}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l-2 border-grey pl-8 pt-3 max-md:hidden sticky top-28 self-start ">
          {
            search ? (
              <>
                <h1 className="font-medium text-xl mb-8">User related to search <i className="fi fi-rr-user" /> </h1>

                <Suspense fallback={<Loader />}>
                  <TrendingBlogs search={search} />
                </Suspense>

              </>
            ) : (
              <div className="flex flex-col gap-10">
                <div>
                  <h1 className="font-medium text-xl mb-8">Topics you might be interested in</h1>

                  <div className="flex gap-3 flex-wrap">
                    <CategoryBtns />
                  </div>
                </div>

                <div>
                  <h1 className="font-medium text-xl mb-8">Trending <TrendingIcon /></h1>

                  <Suspense fallback={<Loader />}>
                    <TrendingBlogs search={search} />
                  </Suspense>

                </div>

              </div>
            )
          }
        </div>

      </section>
    </AnimationWrapper >
  );
};
