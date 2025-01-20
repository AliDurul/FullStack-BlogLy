import React from 'react'

export default function NoDataFound({ message }: { message: string }) {
    return (
        <div className='text-center w-full p-4 rounded-full bg-grey/50 mt-4'>
            <p>
                {message}
            </p>
        </div>
    )
}
