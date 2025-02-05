'use client'

import { useActionState, useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ISingleBlog } from '@/types/blogTypes'
import CommentField from './CommentField'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createComment, fetchCommentsOfBlog } from '@/lib/actions/blogActions'
import Loader from '../shared/Loader'
import NoDataFound from '../root/NoDataFound'
import AnimationWrapper from '../shared/AnimationWrapper'
import CommentCard from './CommentCard'
import { createContext, useContext } from 'react';

// import { XMarkIcon } from '@heroicons/react/24/outline'
// import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

interface ICommentsContainerProps {
  open: boolean
  setOpen: (value: boolean) => void
  blog: ISingleBlog
}

/* Context */
interface CommentsContextProps {
  newComments: any[];
  setNewComments: React.Dispatch<React.SetStateAction<any[]>>;
  state: any;
  action: any;
  isPending: boolean;
  blog: ISingleBlog;
}

const CommentsContext = createContext<CommentsContextProps | undefined>(undefined);

export const useCommentsContext = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useCommentsContext must be used within a CommentsProvider');
  }
  return context;
};


export default function CommentsContainer({ open, setOpen, blog }: ICommentsContainerProps) {

  const [newComments, setNewComments] = useState<any[]>([])

  const [state, action, isPending] = useActionState(createComment, null)

  useEffect(() => {
    if (state?.success && state?.result) {
      setNewComments(prev => [...prev, state.result])
    }
  }, [state])


  const { data, error, status, fetchNextPage, isFetchingNextPage, hasNextPage, } = useInfiniteQuery({
    queryKey: ['comments', blog._id],
    queryFn: ({ pageParam }) => fetchCommentsOfBlog(blog._id, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.details?.next) return null
      return lastPage?.details?.next
    },
  });


  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <div className="fixed inset-0" />
      <CommentsContext.Provider value={{ newComments, setNewComments, state, action, isPending, blog }}>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 top-[80px] flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-2xl transform transition duration-700 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <DialogTitle className="text-base font-semibold text-gray-900">Comments</DialogTitle>
                        <p className='text-2xl mt-2 w[70%] text-dark-grey line-clamp-1'> {blog.title} </p>
                      </div>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <i className='fi fi-rr-cross text-xl' />
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr className='border-grey border-2 mb-8 w-full ' />
                  {/* Main */}
                  <div className='px-4 sm:px-6 pb-5'>

                    <CommentField actionType='comment' />

                    {
                      status === 'pending' && <Loader />
                    }

                    {
                      newComments.length > 0 && (
                        <>
                          {
                            newComments.map((comment, i) => {
                              return (
                                <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                  <CommentCard commentData={comment} />
                                </AnimationWrapper>
                              )
                            })
                          }
                        </>
                      )
                    }

                    {
                      data?.pages.map((page: any, i: number) => {
                        return (
                          <div key={i}>
                            {
                              page.result.length ? (
                                page?.result.map((comment: any, i: number) => {
                                  return (
                                    <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                      <CommentCard commentData={comment} />
                                    </AnimationWrapper>
                                  )
                                })
                              ) : (<NoDataFound message='No comments found.' />)
                            }
                          </div>
                        )
                      })
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
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </CommentsContext.Provider>

    </Dialog>
  )
}

