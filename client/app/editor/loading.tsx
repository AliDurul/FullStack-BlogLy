import Loader from '@/components/shared/Loader'
import React from 'react'

export default function Loading() {
    return (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw] relative animate-pulse">
            {/* Banner Placeholder */}
            <div className="w-full h-[200px] md:h-[500px] bg-gray-300 rounded-lg aspect-video"></div>

            {/* Blog Info */}
            <div className="mt-12">
                {/* Title Placeholder */}
                <div className="w-full h-20 bg-gray-300 rounded mb-16"></div>
                <div className="w-1/3 h-14 bg-gray-300 rounded mb-6"></div>
            </div>
        </div>
    )
}
