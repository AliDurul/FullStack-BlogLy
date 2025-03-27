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



type SearchParams = Promise<{ [key: string]: string | undefined }>


export default async function Home(props: { searchParams: SearchParams }) {

  const session = await getSession();
  const searchParams = await props.searchParams
  const category = searchParams.category || ''
  const search = searchParams.search || ''

  const defaultRoutes = [category === '' ? 'Home' : category, 'trending blogs']
  const defaultHidden = ['trending blogs']
  const searchRoutes = [`Search Results from "${search}"`, "Accounts Matched"]
  const searchHidden = ['Accounts Matched']

  if (session?.error === "RefreshTokenError") {
    await signIn("google") // Force sign in to obtain a new set of access and refresh tokens
  }
  return (
    <AnimationWrapper >
      <section className="h-cover flex justify-center gap-10">

        {/* latest blogs */}
        <div className="w-full">

          <InPageNavigation routes={search ? searchRoutes : defaultRoutes} defaultHidden={search ? searchHidden : defaultHidden} >

            <Blogs />

            <Suspense fallback={<Loader />}>
              <TrendingBlogs search={search} />
            </Suspense>

          </InPageNavigation>

        </div>

        {/*  filters and trending blogs*/}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l-2 border-grey pl-8 pt-3 max-md:hidden">
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
                  <h1 className="font-medium text-xl mb-8">Stories form all interests</h1>

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
