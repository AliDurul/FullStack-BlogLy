'use client'

import PublishHeaderBtn from '@/components/PublishHeaderBtn'
import AnimationWrapper from '@/components/shared/AnimationWrapper'
import Tag from '@/components/Tag'
import { useEditorContext } from '@/contexts/EditorContext'
import { createBlog } from '@/lib/actions/blogActions'
import { blogPublishSchema } from '@/lib/zod'
import Image from 'next/image'
import React, { useActionState } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'

export default function EditorPublishPage() {

  const charLimit = 200;
  const tagLimit = 10;

  let { blog: { banner, title, tags, des }, setBlog, blog } = useEditorContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlog(prev => ({ ...prev, [name]: value }));
  }

  const handleDesKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();

      let value = e.currentTarget.value.trim();
      if (!value) {
        toast.error('Topic cannot be empty');
      } else if (tags.length >= tagLimit) {
        toast.error(`You can only add up to ${tagLimit} topics`);
      } else if (tags.includes(value)) {
        toast.error('Topic already exists');
      } else {
        setBlog(prev => ({ ...prev, tags: [...prev.tags, value] }));
      }
      e.currentTarget.value = '';
    }
  }

  const handlePublishBlog = async (e: any) => {
    // Validate the blog data

    const result = blogPublishSchema.safeParse(blog);

    if (!result.success) {
      Object.values(result.error.flatten().fieldErrors).forEach((errors) => {
        if (errors) {
          errors.forEach((error) => {
            toast.error(error);
          });
        }
      });
      return;
    }

    let loadingToast = toast.loading('Publishing...');

    e.target.disabled = true;

    const res = await createBlog(blog);

    toast.dismiss(loadingToast);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

  }




  return (
    <AnimationWrapper>
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
        <PublishHeaderBtn />

        <div>
          <p className='text-dark-grey mb-1'>Preview</p>
          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <Image src={banner} width={375} height={812} alt='Banner' />
          </div>
          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>
          <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4 '> {des} </p>
        </div>

        <div className='border-grey lg-border-1 lg:pl-8'>

          <p className='text-dark-grey mb-2 mt-9'>Blog Title</p>
          <input className='input-box pl-4' name='title' onChange={handleChange} type="text" placeholder='BLog Title' defaultValue={title} />

          <p className='text-dark-grey mb-2 mt-9'>Blog Short description about your blog</p>
          <textarea
            maxLength={charLimit}
            onChange={handleChange}
            onKeyDown={handleDesKeyDown}
            defaultValue={des} className='h-40 resize-none leading-7 input-box pl-4' name="des" />

          <p className='text-dark-grey mt-1 text-sm text-right'> {charLimit - des.length} characters left</p>

          <p className='text-dark-grey mb-2 mt-9'>Topics - (Helps is searching and ranking your blog post)</p>

          <div className='relative input-box pl-2 pb-4'>

            <input
              className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white'
              type="text"
              onKeyDown={handleTopicKeyDown}
              placeholder='Topic' />

            {tags.map((tag, i) => <Tag key={i} tagIndex={i} tag={tag} />)}
          </div>

          <p className='mt-1 mb-4 text-dark-grey text-right'> {tagLimit - tags.length} tags left </p>

          <button
            // disabled={isPending}
            onClick={handlePublishBlog}
            className='btn-dark px-8'
          >
            Publish
          </button>

        </div>

      </section>
    </AnimationWrapper>
  )
}