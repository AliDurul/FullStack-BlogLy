'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import darkDefaultBanner from "@/public/assets/images/blog banner dark.png";
import lightDefaultBanner from "@/public/assets/images/blog banner light.png";
import { uploadImage } from '@/lib/actions/uploadImageAction';
import toast, { Toaster } from 'react-hot-toast';
import { useEditorContext } from '@/contexts/EditorContext';
import EditorJS from '@editorjs/editorjs'
import { EditorTools } from './EditorTools';
import { useThemeContext } from '@/contexts/ThemeContext';


export default function BlogEditorForm({ editableBlog }: { editableBlog?: any }) {

  const { blog: { banner, title, content, tags, des, author }, blog, setTextEditor, setBlog, textEditor } = useEditorContext();
  const { theme } = useThemeContext()

  useEffect(() => {
    if (editableBlog) {
      setBlog(editableBlog);
    }
  }, [editableBlog]);

  useEffect(() => {
    if (!textEditor) {
      setTextEditor(new EditorJS({
        holder: 'textEditor',
        tools: EditorTools,
        placeholder: "Let's write an awesome blog",
        data: {
          time: new Date().getTime(),
          blocks: Array.isArray(blog?.content) && editableBlog ? editableBlog.content : blog?.content
        },
      }));
    }
  }, [textEditor, blog, editableBlog]);


  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    let img = e.target.files![0];

    if (!img) return

    let loadingToast = toast.loading('Uploading image...')

    try {
      const url = await uploadImage(img);
      console.log('this is the url', url);

      if (url) {
        toast.dismiss(loadingToast);
        toast.success('Image uploaded successfully ✌🏻')
        setBlog(prev => ({ ...prev, banner: url }))
      }

    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image 😞';
      return toast.error(errorMessage);
    }


  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            <Image 
              src={banner ? banner : (theme === 'light' ? lightDefaultBanner : darkDefaultBanner)} 
              alt='defaultBanner' 
              className='z-20 cursor-pointer' 
              width={300} 
              height={300} 
            />
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
          defaultValue={title}
          placeholder='Blog Title here...'
          className='text-4xl w-full h-24 font-medium outline-none resize-none mt-10 leading-tight placeholder:opacity-50 bg-white'
          onKeyDown={handleTitleKeyDown}
          onChange={handleTitleChange}
        />

        <hr className='w-full opacity-10 my-5' />

        <div id='textEditor' className='font-gelasio' />

      </div>
    </section>
  )
}
