import AnimationWrapper from '@/components/shared/AnimationWrapper'
import { fetchUser } from '@/lib/actions/userActions'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'
import getSession from '@/lib/utils'
import AboutUser from '@/components/profile/AboutUser'
import InPageNavigation from '@/components/auth/InPageNavigation'
import Blogs from '@/components/root/Blogs'
import BlogsSkeleton from '@/components/root/BlogsSkeleton'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const user = await fetchUser(slug);

  if ('message' in user) {
    return {
      title: 'User Not Found',
      description: 'The user profile you are looking for does not exist.',
      robots: 'noindex, nofollow',
    };
  }

  const { result: { personal_info: { fullname, username, profile_img }, account_info: { total_posts, total_reads } } } = user;

  return {
    title: `${fullname} (@${username}) - BlogLy`,
    description: `${fullname} has published ${total_posts} blogs with a total of ${total_reads} reads. Explore their profile on BlogLy.`,
    openGraph: {
      title: `${fullname} (@${username}) - BlogLy`,
      description: `${fullname} has published ${total_posts} blogs with a total of ${total_reads} reads. Explore their profile on BlogLy.`,
      url: `https://blogly.vercel.app/user/${slug}`,
      images: [
        {
          url: profile_img,
          width: 800,
          height: 800,
          alt: `${fullname}'s Profile Picture`,
        },
      ],
      type: 'profile',
      siteName: 'BlogLy',
    },
    robots: 'index, follow',
  };
};

interface IUserProfilePageParams {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function UserProfilePage({ params, searchParams }: IUserProfilePageParams) {

  const { slug } = await params;
  const queries = await searchParams;
  const session = await getSession()

  const category = queries.category || '';
  const search = queries.search || '';
  const pageParam = (queries.pageParam || 1) as number;

  const user = await fetchUser(slug)

  if ('message' in user) redirect('/404');

  const { result: {
    personal_info: { fullname, username, email, bio, profile_img },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
    _id
  } } = user


  return (
    <AnimationWrapper>
      <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
        <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border md:border-grey md:sticky md:top-[100px] md:py-10'>
          <Image src={profile_img} alt={fullname} width={200} height={200} className='rounded-full bg-grey size-48 md:size-32' />
          <h1 className='text-2xl font-medium'> {username} </h1>
          <p className='text-xl capitalize h-6'> {fullname} </p>
          <p> {total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads </p>


          <div className="flex gap-4 mt-2">
            {
              session?.user?.username === username && (
                <Link className='btn-dark px-3 py-2  rounded-md' href={'/edit-profile'}>Edit Profile</Link>
              )
            }
          </div>

          <AboutUser social_links={social_links} bio={bio} joinedAt={joinedAt} className='max-md:hidden' />

        </div>


        <div className='max-md:mt-12 w-full'>
          <InPageNavigation routes={['Blogs Published', 'About']} defaultHidden={['About']} >


            <Suspense fallback={<BlogsSkeleton />}>
              <Blogs author={_id} category={category} search={search} pageParam={pageParam} />
            </Suspense>

            <AboutUser social_links={social_links} bio={bio} joinedAt={joinedAt} />

          </InPageNavigation>

        </div>
      </section>

    </AnimationWrapper>
  )



}
