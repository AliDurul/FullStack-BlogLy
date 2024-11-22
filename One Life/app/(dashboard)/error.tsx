'use client'

import { useEffect } from 'react'
import BlankLayout from '../components/Layout/BlankLayout'
import { useRouter } from 'next/navigation'

export default function Error({ error, reset, }: {
    error: Error & { digest?: string }
    reset: () => void
}) {

    const router = useRouter();
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className=" min-h-[calc(100vh-125px)] bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/errorPage.png')" }}>
            <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Something went wrong!</h1>
                <p className="mt-4 text-base text-white/100 sm:mt-6">Sorry, Refresh the page or getting touch with IT support.</p>
                <div className="mt-10 flex justify-center gap-9">
                    <button onClick={() => router.back()} className="text-sm font-semibold leading-7 text-white">
                        <span aria-hidden="true">&larr;</span> Back to previous page 
                    </button>
                    <button onClick={() => reset()} className="text-sm font-semibold leading-7 text-white">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    )
}
Error.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};

