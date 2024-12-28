'use client'


import React from 'react'
import InputBox from '@/components/InputBox';

export default function AuthForm() {
  const type = 'sign-in' as 'sign-in' | 'sign-up'
  return (
    <form action="" className='w-[80%] max-w-[400px]'>
      <h1 className='text-4xl font-gelasio capitalize text-center'>
        {type == 'sign-in' ? 'Welcome back' : 'Join us today'}
      </h1>
      {
        type !== 'sign-in' ?
          <InputBox
            name="fullname"
            type="text"
            placeholder="full name"
            
          />
      : ""
      }
    </form>
  )
}
