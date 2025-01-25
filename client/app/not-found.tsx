import Image from "next/image";
import Link from "next/link";
import pageNotFoundImg from '@/public/assets/images/404.png';
import fullLogo from '@/public/assets/images/full-logo.png';

export default function NotFound() {
    return (
        <div className="h-cover relative p-10 flex flex-col items-center justify-center gap-20">

            <Image src={pageNotFoundImg} className="select-none border-2 border-grey w-72  object-cover rounded"  alt="404" />


            <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
            <p className="text-dark-grey text-xl leading-7 -mt-8">The page you are looking for does not exists. Head back to the <Link href="/" className="text-black underline">home page.</Link>  </p>

            <div className="mt-auto">
                <Image src={fullLogo} className="h-8 object-contain block mx-auto select-none" width={300} height={300} alt="logo" />
                <p className="mt-5 text-dark-grey">Read millions of stroies around world. </p>
            </div>
        </div>
    )
}