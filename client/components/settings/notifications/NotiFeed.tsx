'use client';

import NoDataFound from "@/components/root/NoDataFound";
import AnimationWrapper from "@/components/shared/AnimationWrapper";
import Loader from "@/components/shared/Loader";
import { fetchNotis } from "@/lib/actions/notiActions";
import { INoti } from "@/types/notiTypes";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import NotiCard from "./noti-card";
import { useEffect } from "react";
import { revalidateTagFn } from "@/lib/actions/revalidateActions";

export default function NotiFeed() {

  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'all';

  const { data, error, status, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['notis', type],
    queryFn: ({ pageParam }) => fetchNotis({ type, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.details?.next) return null;
      return lastPage?.details?.next;
    },
  });


  // useEffect(() => {
  //   if (status === 'success') {
  //     revalidateTagFn('newNotif')
  //   }
  // }, [data, status])

  if (status === 'pending') return <Loader />;
  if (error) return <NoDataFound message='Failed to load notifications 😞' />;
  if (data && data.pages && data.pages.length && !data.pages[0].success) return <NoDataFound message='Something went wrong, please try again.' />;


  return (
    <>
      {
        data?.pages.map((page: any, i: number) => (
          <div key={i}>
            {
              page.result.length ? (
                page?.result.map((notification: INoti, i: number) => (
                  <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                    <NotiCard notification={notification} index={i} refetchNotifications={refetch} />
                  </AnimationWrapper>
                ))
              ) : (<NoDataFound message='Dont have any notification ' />)
            }
          </div>
        ))
      }
      {
        isFetchingNextPage && <Loader />
      }
      {
        hasNextPage && (
          <button
            disabled={!hasNextPage}
            className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
            onClick={() => fetchNextPage()}
          >
            Load More
          </button>
        )
      }
    </>
  );
}
