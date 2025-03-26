import React from 'react';

export default function loading() {
  return (
    <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
      <div className='max-lg:center mb-5'>
        <div className='relative block size-48 bg-grey rounded-full overflow-hidden animate-pulse'>
          <div className='w-full h-full bg-gray-300'></div>
        </div>
        <div className='btn-light mt-5 max-lg:center lg:w-full px-10 h-10 bg-gray-300 animate-pulse'></div>
      </div>

      <div className='w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5 animate-pulse'>
          <div className='input-box h-14 bg-gray-300 '></div>
          <div className='input-box h-14 bg-gray-300 '></div>
        </div>

        <div className='input-box h-14 bg-gray-300 animate-pulse mt-5'></div>
        <div className='input-box h-64 lg:h-40 bg-gray-300 animate-pulse mt-5'></div>

        <div className='my-6 text-dark-grey'>Add your social handles below</div>

        <div className='md:grid md:grid-cols-2 gap-6 animate-pulse'>
          <div className='input-box h-14 bg-gray-300 '></div>
          <div className='input-box h-14 bg-gray-300 '></div>
          <div className='input-box h-14 bg-gray-300 '></div>
          <div className='input-box h-14 bg-gray-300 '></div>
        </div>

        <div className='btn-dark w-auto px-10 h-14 bg-gray-300 animate-pulse mt-5'></div>
      </div>
    </div>
  );
}
