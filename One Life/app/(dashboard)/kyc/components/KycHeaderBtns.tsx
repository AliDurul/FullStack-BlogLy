'use client'
import { selectValue, setValue, updateKycState } from '@/lib/features/kyc/kycSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import React from 'react'

const KycHeaderBtns = () => {
    const router = useRouter()
    const value = useAppSelector(selectValue)
    const dispatch = useAppDispatch();

    return (
        <>
            <div>
                <button type="button" className="btn btn-primary" onClick={() => { router.push(`/kyc/action?s=e`), dispatch(updateKycState(null)) }}>
                    <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path
                            opacity="0.5"
                            d="M18 17.5C18 19.9853 18 22 10 22C2 22 2 19.9853 2 17.5C2 15.0147 5.58172 13 10 13C14.4183 13 18 15.0147 18 17.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Add New Client
                </button>
            </div>
            <div>
                <button type="button" className={`btn btn-outline-primary p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => dispatch(setValue('list'))}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                        <path d="M2 5.5L3.21429 7L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path opacity="0.5" d="M2 12.5L3.21429 14L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 19.5L3.21429 21L7.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 19L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M22 12L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M22 5L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
            <div>
                <button type="button" className={`btn btn-outline-primary p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => dispatch(setValue('grid'))}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                        <path
                            opacity="0.5"
                            d="M2.5 6.5C2.5 4.61438 2.5 3.67157 3.08579 3.08579C3.67157 2.5 4.61438 2.5 6.5 2.5C8.38562 2.5 9.32843 2.5 9.91421 3.08579C10.5 3.67157 10.5 4.61438 10.5 6.5C10.5 8.38562 10.5 9.32843 9.91421 9.91421C9.32843 10.5 8.38562 10.5 6.5 10.5C4.61438 10.5 3.67157 10.5 3.08579 9.91421C2.5 9.32843 2.5 8.38562 2.5 6.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path
                            opacity="0.5"
                            d="M13.5 17.5C13.5 15.6144 13.5 14.6716 14.0858 14.0858C14.6716 13.5 15.6144 13.5 17.5 13.5C19.3856 13.5 20.3284 13.5 20.9142 14.0858C21.5 14.6716 21.5 15.6144 21.5 17.5C21.5 19.3856 21.5 20.3284 20.9142 20.9142C20.3284 21.5 19.3856 21.5 17.5 21.5C15.6144 21.5 14.6716 21.5 14.0858 20.9142C13.5 20.3284 13.5 19.3856 13.5 17.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M2.5 17.5C2.5 15.6144 2.5 14.6716 3.08579 14.0858C3.67157 13.5 4.61438 13.5 6.5 13.5C8.38562 13.5 9.32843 13.5 9.91421 14.0858C10.5 14.6716 10.5 15.6144 10.5 17.5C10.5 19.3856 10.5 20.3284 9.91421 20.9142C9.32843 21.5 8.38562 21.5 6.5 21.5C4.61438 21.5 3.67157 21.5 3.08579 20.9142C2.5 20.3284 2.5 19.3856 2.5 17.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M13.5 6.5C13.5 4.61438 13.5 3.67157 14.0858 3.08579C14.6716 2.5 15.6144 2.5 17.5 2.5C19.3856 2.5 20.3284 2.5 20.9142 3.08579C21.5 3.67157 21.5 4.61438 21.5 6.5C21.5 8.38562 21.5 9.32843 20.9142 9.91421C20.3284 10.5 19.3856 10.5 17.5 10.5C15.6144 10.5 14.6716 10.5 14.0858 9.91421C13.5 9.32843 13.5 8.38562 13.5 6.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </button>
            </div>
        </>
    )
}

export default KycHeaderBtns