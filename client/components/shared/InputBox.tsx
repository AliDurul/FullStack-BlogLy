'use client'

import React, { useState } from 'react'

type TInputField = {
  name: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  id?: string;
  value?: string;
  icon?: string;
  errors?: any;
  disabled?: boolean;
};

export default function InputBox({ name, type, id, value, placeholder, icon, errors, disabled = false }: TInputField) {
  const [isPassVisible, setIsPassVisible] = useState(false)
  return (
    <div className='mb-4'>
      <div className='relative w-[100%]'>
        <input
          name={name}
          type={isPassVisible ? 'text' : type}
          placeholder={placeholder}
          defaultValue={value}
          id={id}
          disabled={disabled}
          className={`input-box ${errors ? 'border-red' : ''}`}
        />
        <i className={`fi input-icon ${icon}`} />
        {
          type === 'password' &&
          <i className={`fi ${isPassVisible ? 'fi-rr-eye' : 'fi-rr-eye-crossed'} input-icon left-auto right-4 cursor-pointer`} onClick={() => setIsPassVisible(prev => !prev)} />
        }
      </div>

      {
        errors && errors.map((error: string, index: number) => (
          <p key={index} className='text-red  pt-1 text-sm '>- {error}</p>
        ))
      }
    </div>

  )
}
