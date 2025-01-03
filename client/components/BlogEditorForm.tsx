'use client'

import Image from 'next/image'
import React, { useRef, useState } from 'react'
import defaultBanner from "@/public/assets/images/blog-banner.png";
import { uploadImage } from '@/lib/actions/uploadImageAction';
import toast, { Toaster } from 'react-hot-toast';
import { useEditorContext } from '@/contexts/EditorContext';


export default function BlogEditorForm() {

  const { blog: { banner, title, content, tags, des, author }, setBlog } = useEditorContext()

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    let img = e.target.files![0];

    if (!img) return

    let loadingToast = toast.loading('Uploading image...')

    try {
      const url = await uploadImage(img)

      if (url) {
        toast.dismiss(loadingToast);
        toast.success('Image uploaded successfully ✌🏻')
        setBlog(prev => ({ ...prev, banner: url }))
      }

    } catch (error) {
      toast.dismiss(loadingToast);
      return toast.error(error || 'Failed to upload image 😞')
    }


  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value)
    let input = e.target
    input.style.height = 'auto'
    input.style.height = `${input.scrollHeight}px`
    setBlog(prev => ({ ...prev, title: e.target.value }))
  }

  return (
    <section>
      <div className='mx-auto  max-w-[900px] w-full '>
        <div className="realative aspect-video hover:opacity-80 bg-white border-4 border-grey">
          <label htmlFor="uploadBanner">
            <Image src={banner || defaultBanner} alt='defaultBanner' className='z-20 cursor-pointer' width={300} height={300} />
            <input
              type="file"
              id='uploadBanner'
              accept='.png, .jpg, jpeg'
              hidden
              onChange={handleBannerChange}
            />
          </label>
        </div>

        <textarea
          name=""
          id=""
          placeholder='Write your blog here...'
          className='text-4xl w-full h-24 font-medium outline-none resize-none mt-10 leading-tight placeholder:opacity-50 '
          onKeyDown={handleTitleKeyDown}
          onChange={handleTitleChange}
        ></textarea>

        <hr className='w-full opacity-10 my-5' />

      </div>
    </section>
  )
}
