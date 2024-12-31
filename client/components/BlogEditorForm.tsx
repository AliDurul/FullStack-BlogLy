'use client'

import Image from 'next/image'
import React from 'react'
import defaultBanner from "@/public/assets/images/blog banner.png";


export default function BlogEditorForm() {

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleBannerChange==>', e.target.files![0]);
    let img = e.target.files![0];
  }

  return (
    <section>
      <div className='mx-auto  max-w-[900px] w-full '>
        <div className="realative aspect-video hover:opacity-80 bg-white border-4 border-grey">
          <label htmlFor="uploadBanner">
            <Image src={defaultBanner} alt='defaultBanner' className='z-20 cursor-pointer' />
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
