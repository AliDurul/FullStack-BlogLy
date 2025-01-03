import React from 'react';
import getSession from '@/lib/utils';
import BlogEditorForm from '@/components/BlogEditorForm';
import Link from 'next/link';
import Image from 'next/image';
import AnimationWrapper from '@/components/shared/AnimationWrapper';
import EditorNav from '@/components/EditorNav';

// this is protected route
export default async function EditorPage() {

  // const session = await getSession()

  return (
    <>
      <EditorNav />

      <AnimationWrapper>
        <BlogEditorForm />
      </AnimationWrapper>

    </>

  )
}
