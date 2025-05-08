import { fetchUser } from '@/lib/actions/userActions'
import React from 'react'
import getSession from '@/lib/utils'
import Image from 'next/image';
import InputBox from '@/components/shared/InputBox';
import EditProfileForm from '@/components/settings/edit-profile/EditProfileForm';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();

  if (!session) {
    return {
      title: 'Session Not Found - BlogLy',
      description: 'Unable to access your profile. Please log in to update your personal information, profile picture, and account details on BlogLy.',
      robots: 'noindex, nofollow',
    };
  }

  const user = await fetchUser(session.user.username);

  if ('message' in user) {
    return {
      title: 'Edit Profile - BlogLy',
      description: 'Update your personal information, profile picture, and account details on BlogLy.',
      robots: 'noindex, nofollow',
    };
  }

  const { result: { personal_info: { fullname, username } } } = user;

  return {
    title: `Edit Profile - ${fullname} (@${username}) | BlogLy`,
    description: `Edit the profile of ${fullname} (@${username}) on BlogLy. Update your personal information, profile picture, and account details.`,
    openGraph: {
      title: `Edit Profile - ${fullname} (@${username}) | BlogLy`,
      description: `Edit the profile of ${fullname} (@${username}) on BlogLy. Update your personal information, profile picture, and account details.`,
      url: 'https://blogly.vercel.app/settings/edit-profile',
      images: [
        {
          url: 'https://blogly.vercel.app/public/assets/images/logo-dark.png',
          width: 800,
          height: 600,
          alt: 'Edit Profile Page',
        },
      ],
      type: 'website',
      siteName: 'BlogLy',
    },
    robots: 'index, follow',
  };
}


export default async function EditProfilePage() {
  const session = await getSession()

  if (!session) return <div>User not found</div>;

  const user = await fetchUser(session.user.username);

  if ('message' in user) {
    return (
      <div>{user?.message}</div>
    )
  }

  return (
    <div>
      <h1 className='max-md:hidden'>Edit Profile</h1>

      <EditProfileForm user={user.result} />

    </div>
  )
}
