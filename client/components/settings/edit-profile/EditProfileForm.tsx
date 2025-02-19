'use client';

import InputBox from '@/components/shared/InputBox'
import { revalidatePathFn } from '@/lib/actions/blogActions'
import { uploadImage } from '@/lib/actions/uploadImageAction'
import { putProfileImg, putUserProfile } from '@/lib/actions/userActions'
import { ISocialLinks, IUser } from '@/types/userTypes'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useActionState, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const bioLimit = 150

export default function EditProfileForm({ user }: { user: IUser }) {
    const { personal_info: { profile_img, fullname, username: profile_username, email, bio }, social_links } = user
    const { data: sessions, update } = useSession()

    const [characterLeft, setCharacterLeft] = useState<number>(bioLimit)
    const [profileImgSrc, setProfileImgSrc] = useState<string>(profile_img)
    const [updatedProfileImg, setUpdatedProfileImg] = useState<File | null>(null)

    const [state, action, isPending] = useActionState(putUserProfile, null)
    console.log(state);
    // Update profile image states
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const img = e.target.files && e.target.files[0];
        if (img) {
            const imgUrl = URL.createObjectURL(img);
            setProfileImgSrc(imgUrl);
            setUpdatedProfileImg(img)
        }
    }
    // upload img to AWS & update session
    const handleImageUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!updatedProfileImg) return;

        const loadingToast = toast.loading('Uploading Image...');
        const button = e.currentTarget;
        button.disabled = true;

        try {
            const imgUrl = await uploadImage(updatedProfileImg);
            if (!imgUrl) throw new Error('Image not uploaded');

            const res = await putProfileImg(imgUrl);
            console.log('res from putProfileImg', res);

            await update({
                user: {
                    ...sessions?.user,
                    profile_img: res.profile_img
                }
            });

            setProfileImgSrc(imgUrl);
            toast.success('Image uploaded successfully');
        } catch (err) {
            toast.error('Failed to upload image');
            console.error(err);
        } finally {
            setUpdatedProfileImg(null);
            toast.dismiss(loadingToast);
            button.disabled = false;
        }
    }

    useEffect(() => {
        // if (state?.errors) {
        //     Object.entries(state?.errors).forEach(([key, value]) => {
        //         if (Array.isArray(value)) {
        //             value.forEach((error) => {
        //                 toast.error(`${key}: ${error}`);
        //             });
        //         } else {
        //             toast.error(`${key}: ${value}`);
        //         }
        //     });
        // }
        if(state?.message){
            toast[state?.success ? 'success' : 'error'](state?.message);
        }
    }, [state?.message])

    return (
        <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10 '>

            <div className='max-lg:center mb-5'>

                <label htmlFor="uploadImg" id='profileImgLable' className='relative block size-48 bg-grey rounded-full overflow-hidden'>
                    <div className='w-full h-full absolute top-0 left-0 bg-black/40 opacity-0 flex items-center justify-center text-white  cursor-pointer hover:opacity-100'>
                        Upload Image
                    </div>

                    <Image src={profileImgSrc} alt='Profile Image' width={200} height={200} />
                </label>

                <input type="file" id='uploadImg' accept='.jpeg, .png, .jpg' hidden onChange={handleImageChange} />

                <button className='btn-light mt-5 max-lg:center lg:w-full px-10' onClick={handleImageUpload}>Upload</button>
            </div>

            <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await action({ payload: formData, userId: user._id });
            }} className='w-full'>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                    <div>
                        <InputBox
                            name='fullname'
                            type='text'
                            value={fullname}
                            placeholder='Full Name'
                            disabled={true}
                            icon='fi-rr-user'
                        />
                    </div>
                    <div>
                        <InputBox
                            name='email'
                            type='email'
                            value={email}
                            placeholder='Email'
                            disabled={true}
                            icon='fi-rr-envelope' />
                    </div>
                </div>

                <InputBox
                    name='username'
                    type='text'
                    value={state?.inputs?.username as string || profile_username}
                    placeholder='Username'
                    icon='fi-rr-at'
                    errors={state?.errors?.username}
                />

                <p className='text-dark-grey -mt-3'>Username will use to search and will be visible to all users.</p>

                <textarea
                    name="bio"
                    id="bio"
                    defaultValue={state?.inputs?.username as string || bio}
                    maxLength={bioLimit}
                    className='input-box h-64 lg:h-40 resize-none left-7 mt-5 pl-5'
                    placeholder='Tell us about yourself..'
                    onChange={(e) => setCharacterLeft(bioLimit - e.target.value.length)}
                ></textarea>

                <p className='mt-1 text-dark-grey'>{characterLeft} characters left</p>

                <p className='my-6 text-dark-grey'>Add your social handles below</p>


                <div className="md:grid md:grid-cols-2 gap-x-6">
                    {
                        Object.keys(social_links).map((key, i) => {
                            let link = social_links[key as keyof ISocialLinks];
                            return (
                                <InputBox
                                    key={i}
                                    name={key}
                                    type='text'
                                    value={link}
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                    icon={`${key !== 'website' ? 'fi-brands-' + key : 'fi-rr-globe'}`}
                                />
                            )

                        })
                    }
                </div>

                <button type='submit' className={`btn-dark w-auto px-10  `}>
                    {isPending ? 'Please wait...' : 'Update'}
                </button>
            </form>

        </div>
    )
}
