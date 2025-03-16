'use client';
import Image from "next/image";
import Link from "next/link";
import darkNotFoundImg from '@/public/assets/images/404-dark.png';
import lightNotFoundImg from '@/public/assets/images/404-light.png';
import darkFullLogo from '@/public/assets/images/full-logo-dark.png';
import lightFullLogo from '@/public/assets/images/full-logo-light.png';
import { useThemeContext } from "@/contexts/ThemeContext";

export default function NotFound() {
    const { theme } = useThemeContext()
    return (
        <div className="h-cover relative p-10 flex flex-col items-center justify-center gap-20">

            <Image src={theme == 'light' ? darkNotFoundImg : lightNotFoundImg} className="select-none border-2 border-grey w-72  object-cover rounded" alt="404" />


            <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
            <p className="text-dark-grey text-xl leading-7 -mt-8">The page you are looking for does not exists. Head back to the <Link href="/" className="text-black underline">home page.</Link>  </p>

            <div className="mt-auto">
                <Image src={theme == 'light' ? darkFullLogo : lightFullLogo} className="h-8 object-contain block mx-auto select-none" width={300} height={300} alt="logo" />
                <p className="mt-5 text-dark-grey">Read millions of stroies around world. </p>
            </div>
        </div>
    )
}