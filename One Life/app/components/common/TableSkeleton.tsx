import React from 'react'
import TopPageNavigation from '../TopPageNavigation'

export default function TableSkeleton() {
    return (
        <div className=" animate-pulse ">
            {/* Message list skeleton */}

            {/* <div className="h-5 flex  gap-3 ">
                <div className=" bg-gray-300 w-1/12 rounded-lg" />
                <div className=" bg-gray-300 w-1/12 rounded-lg" />
            </div> */}
            <TopPageNavigation  />
            <div className="h-9 flex justify-between gap-1  mt-7">
                <div className=" bg-gray-300 w-1/12 rounded-lg" />
                <div className=" bg-gray-300 w-2/12 rounded-lg" />
            </div>

            <div className='h-9 mt-3 bg-gray-300 w-full' />

            {[...Array(10)].map((_, i) => (
                <div key={i} className='h-8 mt-4 flex space-x-3 border-b-2 p-1' >
                    <input type="checkbox" className="bg-gray-300 w-7" />
                    <div className=" bg-gray-400 w-1/12 rounded-md" />
                    <div className=" bg-gray-400 w-2/12 rounded-md" />
                    <div className=" bg-gray-400 w-2/12 rounded-md" />
                    <div className=" bg-gray-400 w-2/12 rounded-md" />
                    <div className=" bg-gray-400 w-2/12 rounded-md" />
                    <div className=" bg-gray-400 w-2/12 rounded-md" />
                    <div className=" bg-gray-400 w-2/12 rounded-md" />
                    <div className=" bg-gray-400 w-1/12 rounded-md" />
                </div>
            ))
            }
            <div className="h-7 flex justify-between gap-1 mt-3">
                <div className=" bg-gray-300 w-1/12 rounded-lg" />
                <div className=" bg-gray-300 w-1/12 rounded-lg" />
            </div>
        </div >
    )
}
