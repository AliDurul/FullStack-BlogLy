import BlogManagementFeed from '@/components/settings/blog-management/BlogManagementFeed'
import React from 'react'
import getSession from "@/lib/utils";
import Search from '@/components/shared/Search';
import type { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();

  if (!session) {
    return {
      title: 'Session Not Found - BlogLy',
      description: 'Unable to access your profile. Please log in to manage your blogs on BlogLy.',
      robots: 'noindex, nofollow',
    };
  }
  const { username, fullname } = session.user;

  return {
    title: `Manage Blogs - ${fullname} (@${username}) | BlogLy`,
    description: `Manage blogs, drafts, and published content of ${fullname} (@${username}) on BlogLy.`,
    openGraph: {
      title: `Manage Blogs - ${fullname} (@${username}) | BlogLy`,
      description: `Manage blogs, drafts, and published content of ${fullname} (@${username}) on BlogLy.`,
      url: 'https://blogly.vercel.app/settings/blog-management',
      images: [
        {
          url: 'https://blogly.vercel.app/public/assets/images/logo-dark.png',
          width: 800,
          height: 600,
          alt: 'Manage Blogs Page',
        },
      ],
      type: 'website',
      siteName: 'BlogLy',
    },
    robots: 'index, follow',
  };
}

export default async function BlogManagementPage() {
  const session = await getSession();

  return (
    <div>
      <h1 className='max-md:hidden'>Manage Blogs</h1>
      <div className='relative max-md:mt-5 md:mt-8 mb-10'>
        <Search placeHolder='Search Blogs' />
        <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey' />
      </div>
      <BlogManagementFeed author={session?.user._id} />
    </div>
  )
}
