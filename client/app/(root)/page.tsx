import { auth } from "@/auth";
import InPageNavigation from "@/components/InPageNavigation";
import LatestBlogs from "@/components/LatestBlogs";
import Loader from "@/components/shared/Loader";
import AnimationWrapper from "@/components/shared/AnimationWrapper";
import { fetchLatestBlogs } from "@/lib/actions/blogActions";
import getSession from "@/lib/utils";
import { Suspense } from "react";

export default async function Home() {

  // const session = await getSession()



  return (
    <AnimationWrapper >
      <section className="h-cover flex justify-center gap-10">

        {/* latest blogs */}
        <div className="w-full">

          <InPageNavigation routes={['home', 'trending blogs']} defaultHidden={['trending blogs']} >

            <Suspense fallback={<Loader />}>
              <LatestBlogs />
            </Suspense>

            <h1>trending blog here</h1>
          </InPageNavigation>
        </div>

        {/*  filters and trending blogs*/}
        <div>

        </div>
      </section>
    </AnimationWrapper>
  );
}
