import React from 'react';
import BlogEditorForm from '@/components/BlogEditorForm';
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
