import Image from 'next/image'
import React from 'react'

const NotePage = () => {
    return (
        <div className="h-full w-full flex justify-center items-center">
            {/* <div>Working on it </div> */}
            <Image src="/assets/images/undercons.jpg" alt="Client Link Logo" className="object-cover w-full " width={1000} height={1000} />
        </div>
    )
}

export default NotePage