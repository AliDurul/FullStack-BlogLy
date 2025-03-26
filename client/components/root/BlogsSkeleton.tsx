import React from 'react'

export default function BlogsSkeleton() {
    return (
        <div className='space-y-6'>
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='flex items-center border-b-2 border-grey pb-5 mb-4 gap-8 animate-pulse'>
                    <div className='w-full '>
                        {/* user */}
                        <div className="flex gap-2 items-center mb-7 ">
                            <div className='rounded-full size-9 bg-grey' />
                            <div className='line-clamp-1 h-7 w-20 bg-grey'></div>
                            <div className="min-w-fit h-7 w-20 bg-grey"> </div>
                        </div>
                        {/* title */}
                        <div className='blog-title bg-grey w-2/5 h-8'></div>
                        {/* desc */}
                        <div className="my-3  max-sm:hidden md:max-[1100px]:hidden bg-grey h-20"></div>
                        {/* footer  */}
                        <div className='flex gap-4 mt-7 '>
                            <span className='btn-light py-1 px-4 w-20'></span>
                            <span className='ml-3 flex items-center gap-2 text-dark-grey cursor-pointer'>
                                <i className='fi fi-rr-heart text-xl' />
                            </span>
                        </div>
                    </div >
                    {/* image */}
                    <div className="h-28 aspect-square bg-grey">
                        <div className='w-full h-full aspect-square object-cover' />
                    </div>
                </div>
            ))
            }
        </div >
    )
}
