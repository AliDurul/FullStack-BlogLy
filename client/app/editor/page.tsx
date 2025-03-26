import React from 'react';
import AnimationWrapper from '@/components/shared/AnimationWrapper';
import EditorNav from '@/components/editor/EditorNav';
import BlogEditorForm from '@/components/editor/BlogEditorForm';

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
