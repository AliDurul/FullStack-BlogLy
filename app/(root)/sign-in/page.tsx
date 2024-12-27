import React from 'react'

export default function SingInPage() {
  const type: 'sign-up' | 'sign-in' = 'sign-in'
  return (
    <section className='h-cover flex items-center justify-center'>
      <form action="" className='w-[80%] max-w-[400px]'>
        <h1 className='text-4xl font-gelasio capitalize text-center'>
          {type == 'sign-in' ? 'Welcome back' : 'Join us today'}
        </h1>
        {
          type !== 'sign-in'
            ? <input type="text" placeholder='hi' />
            : ""
        }
      </form>

    </section>
  )
}
