import React from 'react';
import getSession from '@/lib/utils';
import BlogEditorForm from '@/components/BlogEditorForm';
import Link from 'next/link';
import Image from 'next/image';
import AnimationWrapper from '@/components/shared/AnimationWrapper';

// this is protected route
export default async function EditorPage() {

  const session = await getSession()


  return (
    <>
      <nav className='navbar'>
        <Link href='/' className='flex-none w-10 ' >
          <Image className='w-full' src='/assets/images/logo.png' width={40} height={44} alt='logo' />
        </Link>
        <p className='max-md:hidden text-black line-clamp-1 w-full'>New Blog</p>

        <div className='flex gap-4 ml-auto'>
          <button className='btn-dark py-2 '>Publish</button>
          <button className='btn-light py-2'>Save Draft</button>
        </div>

      </nav>

      <AnimationWrapper>
        <BlogEditorForm />
      </AnimationWrapper>

    </>

  )
}
