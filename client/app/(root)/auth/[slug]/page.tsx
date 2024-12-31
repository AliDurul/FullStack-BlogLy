import AnimationWrapper from '@/components/shared/AnimationWrapper';
import Link from 'next/link';
import React from 'react'
import AuthForm from '@/components/AuthForm';
import SocialBtns from '@/components/SocialBtns';

export default async function AuthSlugPage({ params, }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    return (
        <AnimationWrapper>
            <section className='h-cover flex flex-col items-center justify-center'>

                <div className='w-[80%] max-w-[400px]'>

                    <AuthForm slug={slug} />

                    <div className="relative mt-6 opacity-15">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-black" />
                        </div>
                        <div className="relative flex justify-center text-sm/6 font-medium">
                            <span className="bg-white px-6 text-gray-900">Or continue with</span>
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
                </div>

            </section >
        </AnimationWrapper>

    )
}
