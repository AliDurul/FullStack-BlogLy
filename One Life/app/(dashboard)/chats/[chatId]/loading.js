import React from 'react'

export default function Loading() {
  return (
    <div className="animate-pulse h-full p-5 flex flex-col space-y-3">
    <div className=" w-full flex justify-between items-center pb-3 border-b-2">
        <div className="flex items-center space-x-2 ">
            <div className="bg-gray-300 size-11 rounded-full" />
            <div className="h-10 bg-gray-300 w-32 rounded-md" />
        </div>
        <div className="flex items-center space-x-2">
            <div className="bg-gray-300 size-7 rounded-md" />
            <div className="bg-gray-300 size-7 rounded-md" />
            <div className="bg-gray-300 size-7 rounded-md" />
        </div>

    </div>
    <div className="flex-1  p-5 space-y-4 ">
        <div className="flex justify-end">
            <div className="h-12 flex  gap-3" >
                <div className="bg-gray-300 w-24 rounded-md" />
                <div className="bg-gray-300 size-11 rounded-full" />
            </div>
        </div>

        <div className="flex">
            <div className="h-12 flex  gap-3" >
                <div className="bg-gray-300 size-11 rounded-full" />
                <div className="bg-gray-300 w-24 rounded-md" />
            </div>
        </div>
        <div className="flex">
            <div className="h-12 flex  gap-3" >
                <div className="bg-gray-300 size-11 rounded-full" />
                <div className="bg-gray-300 w-24 rounded-md" />
            </div>
        </div>
        <div className="flex justify-end">
            <div className="h-12 flex  gap-3" >
                <div className="bg-gray-300 w-24 rounded-md" />
                <div className="bg-gray-300 size-11 rounded-full" />
            </div>
        </div>
        <div className="flex">
            <div className="h-12 flex  gap-3" >
                <div className="bg-gray-300 size-11 rounded-full" />
                <div className="bg-gray-300 w-24 rounded-md" />
            </div>
        </div>
        <div className="flex">
            <div className="h-12 flex  gap-3" >
                <div className="bg-gray-300 size-11 rounded-full" />
                <div className="bg-gray-300 w-24 rounded-md" />
            </div>
        </div>
    </div>
    <div className="h-6 flex space-x-2">
        <div className="flex-1 bg-gray-300 rounded-full " />
        <div className="bg-gray-300 w-40 rounded-md" />
    </div>
</div>
  )
}
