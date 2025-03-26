import React from 'react'

export default function Loading() {
  return (
    <div className="max-w-[900px] center py-10 max-lg:px-[5vw] relative animate-pulse">
      {/* Banner Placeholder */}
      <div className="w-full h-[200px] md:h-[500px] bg-gray-300 rounded-lg aspect-video"></div>

      {/* Blog Info */}
      <div className="mt-12">
        {/* Title Placeholder */}
        <div className="w-3/4 h-10 bg-gray-300 rounded mb-6"></div>

        {/* Author & Published Date */}
        <div className="flex max-sm:flex-col justify-between my-8">
          <div className="flex gap-5 items-start">
            {/* Profile Image Placeholder */}
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>

            {/* Author Name Placeholder */}
            <div className="flex flex-col">
              <div className="w-32 h-4 bg-gray-300 rounded mb-2"></div>
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Published Date Placeholder */}
          <div className="w-1/4 h-5 bg-gray-300 rounded max-sm:mt-6 max-sm:ml-12 max-sm:pl-5"></div>
        </div>
      </div>

      {/* Blog Interactions Placeholder */}
      <div className="flex justify-between items-center">
        <div className="w-40 h-7 bg-gray-300 rounded"></div>
        <div className="w-40 h-7 bg-gray-300 rounded"></div>
      </div>
      {/* <div className="h-10 bg-gray-300 rounded w-full my-6"></div> */}

      {/* Blog Content Placeholder */}
      <div className="my-12 font-gelasio blog-page-content">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="my-4 md:my-8">
              <div className="w-full h-6 bg-gray-300 rounded mb-2"></div>
              <div className="w-5/6 h-6 bg-gray-300 rounded mb-2"></div>
              <div className="w-2/3 h-6 bg-gray-300 rounded"></div>
            </div>
          ))}
      </div>

      {/* Similar Posts Placeholder */}
      <div className="my-8">
        <div className="w-1/3 h-6 bg-gray-300 mx-auto rounded mb-7"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
        </div>
      </div>
    </div>
  )
}
