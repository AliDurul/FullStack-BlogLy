import ChangePasswordForm from '@/components/settings/ChangePasswordForm'
import AnimationWrapper from '@/components/shared/AnimationWrapper'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Change Password - BlogLy',
  description: 'Secure your BlogLy account by updating your password. Ensure your account remains safe and protected.',
};

export default function ChangePasswordPage() {

  return (
    <AnimationWrapper>
      <ChangePasswordForm />
    </AnimationWrapper>
  )
}
