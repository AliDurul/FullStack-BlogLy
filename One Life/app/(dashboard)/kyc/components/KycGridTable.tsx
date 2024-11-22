'use client'

import { selectKycs, selectValue } from '@/lib/features/kyc/kycSlice';
import { useAppSelector } from '@/lib/hooks';
import { Kyc } from '@/types/types';
import Image from 'next/image';
import React, { useState } from 'react'

const IMG_URL = process.env.NEXT_PUBLIC_IMG_APIBASE_URL;


export default function KycGridTable() {

    // const [filteredItems] = useState<any>([
    //     {
    //         id: 1,
    //         path: 'profile-35.png',
    //         name: 'Alan Green',
    //         role: 'Web Developer',
    //         email: 'alan@mail.com',
    //         location: 'Boston, USA',
    //         phone: '+1 202 555 0197',
    //         posts: 25,
    //         followers: '5K',
    //         following: 500,
    //     },
    //     {
    //         id: 2,
    //         path: 'profile-35.png',
    //         name: 'Linda Nelson',
    //         role: 'Web Designer',
    //         email: 'linda@mail.com',
    //         location: 'Sydney, Australia',
    //         phone: '+1 202 555 0170',
    //         posts: 25,
    //         followers: '21.5K',
    //         following: 350,
    //     },
    //     {
    //         id: 3,
    //         path: 'profile-35.png',
    //         name: 'Lila Perry',
    //         role: 'UX/UI Designer',
    //         email: 'lila@mail.com',
    //         location: 'Miami, USA',
    //         phone: '+1 202 555 0105',
    //         posts: 20,
    //         followers: '21.5K',
    //         following: 350,
    //     },
    //     {
    //         id: 4,
    //         path: 'profile-35.png',
    //         name: 'Andy King',
    //         role: 'Project Lead',
    //         email: 'andy@mail.com',
    //         location: 'Tokyo, Japan',
    //         phone: '+1 202 555 0194',
    //         posts: 25,
    //         followers: '21.5K',
    //         following: 300,
    //     },
    //     {
    //         id: 5,
    //         path: 'profile-35.png',
    //         name: 'Jesse Cory',
    //         role: 'Web Developer',
    //         email: 'jesse@mail.com',
    //         location: 'Edinburgh, UK',
    //         phone: '+1 202 555 0161',
    //         posts: 30,
    //         followers: '20K',
    //         following: 350,
    //     },
    //     {
    //         id: 6,
    //         path: 'profile-35.png',
    //         name: 'Xavier',
    //         role: 'UX/UI Designer',
    //         email: 'xavier@mail.com',
    //         location: 'New York, USA',
    //         phone: '+1 202 555 0155',
    //         posts: 25,
    //         followers: '21.5K',
    //         following: 350,
    //     },
    //     {
    //         id: 7,
    //         path: 'profile-35.png',
    //         name: 'Susan',
    //         role: 'Project Manager',
    //         email: 'susan@mail.com',
    //         location: 'Miami, USA',
    //         phone: '+1 202 555 0118',
    //         posts: 40,
    //         followers: '21.5K',
    //         following: 350,
    //     },
    //     {
    //         id: 8,
    //         path: 'profile-35.png',
    //         name: 'Raci Lopez',
    //         role: 'Web Developer',
    //         email: 'traci@mail.com',
    //         location: 'Edinburgh, UK',
    //         phone: '+1 202 555 0135',
    //         posts: 25,
    //         followers: '21.5K',
    //         following: 350,
    //     },
    //     {
    //         id: 9,
    //         path: 'profile-35.png',
    //         name: 'Steven Mendoza',
    //         role: 'HR',
    //         email: 'sokol@verizon.net',
    //         location: 'Monrovia, US',
    //         phone: '+1 202 555 0100',
    //         posts: 40,
    //         followers: '21.8K',
    //         following: 300,
    //     },
    //     {
    //         id: 10,
    //         path: 'profile-35.png',
    //         name: 'James Cantrell',
    //         role: 'Web Developer',
    //         email: 'sravani@comcast.net',
    //         location: 'Michigan, US',
    //         phone: '+1 202 555 0134',
    //         posts: 100,
    //         followers: '28K',
    //         following: 520,
    //     },
    //     {
    //         id: 11,
    //         path: 'profile-35.png',
    //         name: 'Reginald Brown',
    //         role: 'Web Designer',
    //         email: 'drhyde@gmail.com',
    //         location: 'Entrimo, Spain',
    //         phone: '+1 202 555 0153',
    //         posts: 35,
    //         followers: '25K',
    //         following: 500,
    //     },
    //     {
    //         id: 12,
    //         path: 'profile-35.png',
    //         name: 'Stacey Smith',
    //         role: 'Chief technology officer',
    //         email: 'maikelnai@optonline.net',
    //         location: 'Lublin, Poland',
    //         phone: '+1 202 555 0115',
    //         posts: 21,
    //         followers: '5K',
    //         following: 200,
    //     },
    // ]);

    const value = useAppSelector(selectValue);

    const kycs = useAppSelector(selectKycs);


    return (
        <>
            {
                value === 'grid' && <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {kycs.results.map((contact: Kyc) => {
                        return (
                            <div className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]" key={contact.id}>
                                <div className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]">
                                    <div className="rounded-t-md bg-white/40 bg-[url('/assets/images/notification-bg.png')] bg-cover bg-center p-6 pb-0">
                                        <Image
                                            width={50}
                                            height={50}
                                            className="mx-auto max-h-40 w-4/5 object-contain"
                                            src={contact.profile_pic ? IMG_URL + contact.profile_pic : '/assets/images/profile-pic.png'} alt="contact_image" />
                                    </div>
                                    <div className="relative -mt-10 px-6 pb-24">
                                        <div className="rounded-md bg-white px-2 py-4 shadow-md dark:bg-gray-900">
                                            <div className="text-xl">{contact.first_name}</div>
                                            <div className="text-white-dark">{contact.profession}</div>
                                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex-auto">
                                                    <div className="text-info">10</div>
                                                    <div>Purchases</div>
                                                </div>
                                                <div className="flex-auto">
                                                    <div className="text-info">15</div>
                                                    <div>Issues</div>
                                                </div>
                                                <div className="flex-auto">
                                                    <div className="text-info">30</div>
                                                    <div>----</div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <ul className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary h-7 w-7 rounded-full p-0">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="h-4 w-4"
                                                            >
                                                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                                            </svg>
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary h-7 w-7 rounded-full p-0">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24px"
                                                                height="24px"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="h-4 w-4"
                                                            >
                                                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                                            </svg>
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary h-7 w-7 rounded-full p-0">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24px"
                                                                height="24px"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="h-4 w-4"
                                                            >
                                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                                <rect x="2" y="9" width="4" height="12"></rect>
                                                                <circle cx="4" cy="4" r="2"></circle>
                                                            </svg>
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary h-7 w-7 rounded-full p-0">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24px"
                                                                height="24px"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="h-4 w-4"
                                                            >
                                                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                                            </svg>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
                                                <div className="truncate text-white-dark">{contact.email}</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Phone :</div>
                                                <div className="text-white-dark">{contact.phone_number}</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Address :</div>
                                                <div className="text-white-dark">{contact.location}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 mt-6 flex w-full gap-4 p-6 ltr:left-0 rtl:right-0">
                                        <button type="button" className="btn btn-outline-primary w-1/2" >
                                            Edit
                                        </button>
                                        <button type="button" className="btn btn-outline-danger w-1/2" >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            }
        </>

    )
}
