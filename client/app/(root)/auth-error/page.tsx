'use client';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import errorImg from '@/public/assets/images/error.png';
import Link from 'next/link';


export default function ErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className="h-cover relative p-10 flex flex-col items-center justify-center gap-10">
            <Image
                src={errorImg}
                className="select-none border-2 border-grey w-96 object-cover rounded"
                alt="Error"
            />
            <h1 className="text-4xl font-gelasio leading-7 text-red-600">Authentication Error!</h1>
            <p className="text-dark-grey text-xl leading-7 text-center max-w-md">{error}</p>
            <Link
                href="/auth/sign-in"
                // onClick={() => reset()}
                className="px-6 py-3 bg-rose-800 text-white rounded hover:bg-red-700 transition-all"
            >
                Try Again
            </Link>
            {/* <p className="text-dark-grey text-sm mt-5">
                Or head back to the <Link href="/" className="text-black underline">home page</Link>.
            </p> */}
        </div>
    );
}