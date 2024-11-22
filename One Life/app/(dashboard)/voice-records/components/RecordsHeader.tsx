'use client'
import React, { useState } from 'react'
import { DeleteIcon } from '@/app/icons'
import { PauseIcon, TickIcon, PlayIcon } from '@/app/icons/NewIcons'

const RecordsHeader = () => {
    const [isRecording, setIsRecording] = useState(false)

    return (
        <div className=' bg-black-dark-light w-full h-72 flex flex-col gap-2 justify-center items-center my-4 '>
            <div className="">
                <button className="bg-white rounded-full p-3 text-red-600 mr-5 ">
                    <DeleteIcon />
                </button>

                <button className="bg-white rounded-full p-4 -translate-y-3 shadow-lg mr-5" onClick={() => setIsRecording(!isRecording)}>
                    {isRecording ? <PauseIcon customCss="w-5 h-5" /> : <PlayIcon customCss="w-5 h-5" />}
                </button>

                <button className="bg-white rounded-full p-3 shadow-md">
                    <TickIcon customCss="w-5 h-5" />
                </button>
            </div>
            {isRecording && <h5 className='text-xl '>Recording...</h5>}

        </div>
    )
}

export default RecordsHeader