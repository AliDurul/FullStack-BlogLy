import { formatDate, getFullDay } from '@/lib/utils'
import { IComment, IPersonalInfo } from '@/types/blogTypes'
import Image from 'next/image'
import React from 'react'

interface ICommentCardProps {
    commentData: IComment,
    // index: number,

}

export default function CommentCard({ commentData }: ICommentCardProps) {

    const { comment, commentedAt, commented_by: { personal_info: { profile_img, fullname, username } } } = commentData

    return (
        <div className='w-full' style={{ paddingLeft: `${2 * 10}` }}>
            <div className='my-5 p-6 rounded-md border border-grey'>
                <div className='flex gap-3 items-center mb-8'>
                    <Image
                        src={profile_img}
                        alt={fullname}
                        className='rounded-full size-6'
                        height={40}
                        width={40}
                    />
                    <p className='line-clamp-1'>
                        <span className='text-dark-grey opacity-75'>{fullname}</span>
                        <span className='font-semibold text-black'> @{username}</span>
                    </p>

                    <p className='min-w-fit'>{formatDate(commentedAt)}</p>

                </div>
                
                <p className='font-gelasio text-xl ml-3'>{comment}</p>
                
                {/* <div>
                    <button className='text-dark-grey font-semibold mt-2'>Reply</button>
                </div> */}


            </div>
        </div>
    )
}
