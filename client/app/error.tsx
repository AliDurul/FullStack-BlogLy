'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import errorImg from '@/public/assets/images/error.png';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="h-cover relative p-10 flex flex-col items-center justify-center gap-10">
            <Image
                src={errorImg}
                className="select-none border-2 border-grey w-96 object-cover rounded"
                alt="Error"
            />
            <h1 className="text-4xl font-gelasio leading-7 text-red-600">Something went wrong!</h1>
            <p className="text-dark-grey text-xl leading-7 text-center max-w-md">{error.message}</p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-rose-800 text-white rounded hover:bg-red-700 transition-all"
            >
                Try Again
            </button>
            <p className="text-dark-grey text-sm mt-5">
                Or head back to the <Link href="/" className="text-black underline">home page</Link>.
            </p>
        </div>
    );
}
