import BlogManagementFeed from '@/components/settings/blog-management/BlogManagementFeed'
import React from 'react'
import getSession from "@/lib/utils";
import Search from '@/components/shared/Search';

export default async function BlogManagementPage() {
  const session = await getSession();

  return (
    <div>
      <h1 className='max-md:hidden'>Manage Blogs</h1>
      <div className='relative max-md:mt-5 md:mt-8 mb-10'>
        <Search placeHolder='Search Blogs' />
        <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'/>
      </div>
      <BlogManagementFeed author={session?.user._id} />
    </div>
  )
}
