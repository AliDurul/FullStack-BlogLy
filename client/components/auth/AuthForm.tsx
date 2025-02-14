'use client'

import React, { useActionState, useEffect } from 'react'
import InputBox from '@/components/shared/InputBox';
import { authCredential } from '@/lib/actions/authActions';
import toast from 'react-hot-toast';
import { TInitialAuthState } from '@/types/index';
import { useRouter } from 'next/navigation';

const initialState: TInitialAuthState = {
  success: false,
  message: '',
}

export default function AuthForm({ slug }: { slug: string }) {

  const [state, action, isPending] = useActionState(authCredential, initialState);

  useEffect(() => {

    if (state?.message !== '') {
        toast[state?.success ? 'success' : 'error'](state?.message);
    }
    
}, [state])



  return (
    <form action={action}>
      <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
        {slug == 'sign-in' ? 'Welcome back' : 'Join us today'}
      </h1>

      {
        slug !== 'sign-in' &&
        <InputBox
          name="fullname"
          type="text"
          placeholder="full name"
          icon="fi-rr-user"
          errors={state?.errors?.fullname}
          value={state?.inputs?.fullname as string}
        />
      }


      <InputBox
        name="email"
        type="email"
        placeholder="Email"
        icon="fi-rr-envelope"
        value={state?.inputs?.email as string}
        errors={state?.errors?.email}

      />

      <InputBox
        name="password"
        type="password"
        placeholder="Password"
        icon="fi-rr-key"
        errors={state?.errors?.password}
        value={state?.inputs?.password as string}
      />


      <button type='submit' disabled={isPending} className='btn-dark center mt-14'>

        {
          isPending ? 'Please wait...' : slug == 'sign-in' ? 'Sign in' : 'Sign up'
        }

      </button>
    </form>
  )
}
