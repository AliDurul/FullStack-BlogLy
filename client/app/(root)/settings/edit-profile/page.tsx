import { fetchUser } from '@/lib/actions/userActions'
import React from 'react'
import getSession from '@/lib/utils'
import Image from 'next/image';
import InputBox from '@/components/shared/InputBox';
import EditProfileForm from '@/components/settings/edit-profile/EditProfileForm';

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
