'use client'

import Image from 'next/image'
import React, { useRef, useState } from 'react'
import defaultBanner from "@/public/assets/images/blog-banner.png";
import { uploadImage } from '@/lib/actions/uploadImageAction';
import toast, { Toaster } from 'react-hot-toast';


export default function BlogEditorForm() {

  const [bannerSrc, setBannerSrc] = useState<string>('/assets/images/blog-banner.png');


  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    let img = e.target.files![0];

    if (!img) return

    let loadingToast = toast.loading('Uploading image...')

    try {

      const url = await uploadImage(img)

      if (url) {
        toast.dismiss(loadingToast);
        setBannerSrc(url);
        toast.success('Image uploaded successfully ✌🏻')
      }
    } catch (error) {

      toast.dismiss(loadingToast);
      return toast.error(error || 'Failed to upload image 😞')
    }


  }

  return (
    <section>
      <div className='mx-auto  max-w-[900px] w-full '>
        <div className="realative aspect-video hover:opacity-80 bg-white border-4 border-grey">
          <label htmlFor="uploadBanner">
            <Image src={bannerSrc} alt='defaultBanner' className='z-20 cursor-pointer' width={300} height={300} />
            <input
              type="file"
              id='uploadBanner'
              accept='.png, .jpg, jpeg'
              hidden
              onChange={handleBannerChange}
            />
          </label>
        </div>
      </div>
    </section>
  )
}
