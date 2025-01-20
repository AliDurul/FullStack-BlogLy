import { auth } from "@/auth";
import InPageNavigation from "@/components/InPageNavigation";
import Loader from "@/components/shared/Loader";
import AnimationWrapper from "@/components/shared/AnimationWrapper";
import { fetchLatestBlogs } from "@/lib/actions/blogActions";
import getSession from "@/lib/utils";
import { Suspense } from "react";
import TrendingBlogs from "@/components/root/TrendingBlogs";
import { TrendingIcon } from "@/components/icons";
import CategoryBtns from "@/components/root/CategoryBtns";
import dynamic from "next/dynamic";

const LatestBlogs = dynamic(() => import('@/components/root/LatestBlogs'), {
  loading: () => <Loader />,
})

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | undefined }>


export default async function Home(props: { searchParams: SearchParams }) {

  const searchParams = await props.searchParams
  const category = searchParams.category || ''
  const query = searchParams.query || ''
  const page = (searchParams.page || 1) as string


  return (
    <AnimationWrapper >
      <section className="h-cover flex justify-center gap-10">

        {/* latest blogs */}
        <div className="w-full">

          <InPageNavigation routes={[category == '' ? 'Home' : category, 'trending blogs']} defaultHidden={['trending blogs']} >

            <Suspense fallback={<Loader />}>
              <TrendingBlogs />
            </Suspense>
            <Suspense fallback={<Loader />}>
              <LatestBlogs category={category} query={query} page={page} />
            </Suspense>

            <LatestBlogs category={category} query={query} page={page} />


          </InPageNavigation>
        </div>

        {/*  filters and trending blogs*/}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l-2 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">Stories form all interests</h1>

              <div className="flex gap-3 flex-wrap">
                <CategoryBtns />
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">Trending <TrendingIcon /></h1>

              <Suspense fallback={<Loader />}>
                <TrendingBlogs />
              </Suspense>

            </div>

          </div>
        </div>

      </section>
    </AnimationWrapper>
  );
};
