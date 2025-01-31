import AnimationWrapper from '@/components/shared/AnimationWrapper'
import { fetchUser } from '@/lib/actions/userActions'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import getSession from '@/lib/utils'
import AboutUser from '@/components/profile/AboutUser'
import InPageNavigation from '@/components/auth/InPageNavigation'
import Blogs from '@/components/root/Blogs'

export default async function UserProfilePage({ params, }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params
  const session = await getSession()

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
                <Link className='btn-primary rounded-md' href={'/settings/edit-profile'}>Edit Profile</Link>
              )
            }
          </div>

          <AboutUser social_links={social_links} bio={bio} joinedAt={joinedAt} className='max-md:hidden' />

        </div>


        <div className='max-md:mt-12 w-full'>
          <InPageNavigation routes={['Blogs Published', 'About']} defaultHidden={['About']} >

            <Blogs author={_id} />

            <AboutUser social_links={social_links} bio={bio} joinedAt={joinedAt} />

          </InPageNavigation>

        </div>
      </section>

    </AnimationWrapper>
  )



}
