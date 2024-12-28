'use client'

import { InputField } from '@/lib/types'
import React, { useState } from 'react'

export default function InputBox({ name, type, id, value, placeholder, icon }: InputField) {
  const [isPassVisible, setIsPassVisible] = useState(false)
  return (
    <div className='relative w-[100%] mb-4 '>
      <input
        name={name}
        type={isPassVisible ? 'text' : type}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        className='input-box'
      />
      <i className={`fi input-icon ${icon}`} />
      {
        type === 'password' &&
        <i className={`fi ${isPassVisible ? 'fi-rr-eye' : 'fi-rr-eye-crossed'} input-icon left-auto right-4 cursor-pointer`} onClick={() => setIsPassVisible(prev => !prev)} />
      }
    </div>
  )
}
