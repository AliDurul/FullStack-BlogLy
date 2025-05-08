import AnimationWrapper from '@/components/shared/AnimationWrapper';
import Link from 'next/link';
import React from 'react'
import AuthForm from '@/components/auth/AuthForm';
import SocialBtns from '@/components/auth/SocialBtns';
import VerifyEmail from '@/components/auth/VerifyEmail';
import ForgetPassword from '@/components/auth/ForgetPassword';
import ResetPassword from '@/components/auth/ResetPassword';
import type { Metadata } from 'next';


type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;

    let title = '';
    let description = '';

    switch (slug) {
        case 'sign-in':
            title = 'Sign In - BlogLy';
            description = 'Sign in to your BlogLy account to access your personalized content.';
            break;
        case 'sign-up':
            title = 'Sign Up - BlogLy';
            description = 'Create a new BlogLy account and join our community.';
            break;
        case 'verify-email':
            title = 'Verify Email - BlogLy';
            description = 'Verify your email address to activate your BlogLy account.';
            break;
        case 'forget-password':
            title = 'Forget Password - BlogLy';
            description = 'Recover your BlogLy account by resetting your password.';
            break;
        case 'reset-password':
            title = 'Reset Password - BlogLy';
            description = 'Set a new password for your BlogLy account.';
            break;
        default:
            title = 'BlogLy';
            description = 'Welcome to BlogLy, your platform for sharing and discovering amazing content.';
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://blogly.vercel.app/auth/${slug}`,
            images: [
                {
                    url: "https://blogly.vercel.app/public/assets/images/logo-dark.png",
                    width: 800,
                    height: 600,
                },
            ],
            type: 'website',
            siteName: 'BlogLy',
        },
        robots: 'index, follow',
    };
};

export default async function AuthSlugPage({ params, }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    return (
        <AnimationWrapper>
            <section className='h-cover flex flex-col items-center justify-center'>

                {
                    slug == 'verify-email'
                        ? (<VerifyEmail />)
                        : slug == 'forget-password'
                            ? (<ForgetPassword />)
                            : slug == 'reset-password'
                                ? <ResetPassword />
                                : (<div className='w-[80%] max-w-[400px]'>

                                    <AuthForm slug={slug} />

                                    <div className="relative mt-6 opacity-15">
                                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-black" />
                                        </div>
                                        <div className="relative flex justify-center text-sm/6 font-medium">
                                            <span className="bg-white px-6 text-dark-grey">Or continue with</span>
                                        </div>
                                    </div>

                                    <SocialBtns />

                                    {
                                        slug == 'sign-in' ?
                                            <div className='mt-6 text-center text-dark-grey text-xl'>
                                                <span className=''>Don't have an account? </span>
                                                <Link href="/auth/sign-up" className=' font-semibold underline text-blue-600'>Join BlogLy Now</Link>
                                            </div>
                                            :
                                            <div className='mt-6 text-center text-dark-grey text-xl'>
                                                <span className=''>Already a member? </span>
                                                <Link href="/auth/sign-in" className=' font-semibold underline text-blue-600'>Sign in here</Link>
                                            </div>
                                    }
                                </div>)
                }



            </section >
        </AnimationWrapper>

    )
}
