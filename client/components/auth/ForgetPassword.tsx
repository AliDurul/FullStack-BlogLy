'use client';
import React, { useActionState, useEffect } from 'react'
import InputBox from '../shared/InputBox'
import { forgetPassword } from '@/lib/actions/authActions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ForgetPassword() {
    const [state, action, isPending] = useActionState(forgetPassword, null);

    const router = useRouter();

    useEffect(() => {
        if (!state?.message) return;

        toast[state.success ? 'success' : 'error'](state.message);

        if (state.success) {
            const timer = setTimeout(() => router.push('/'), 1000);
            return () => clearTimeout(timer);
        }
    }, [state, router]);

    return (
        <div className='w-[80%] max-w-[400px]'>
            <form action={action}>
                <h1 className='text-4xl font-gelasio capitalize text-center mb-14'>
                    Reset Your Password
                </h1>

                <InputBox
                    name="email"
                    type="email"
                    placeholder="Email"
                    icon="fi-rr-envelope"
                />
                <div className='mt-5 text-center text-dark-grey text-xl'>
                    <span>
                        Enter your registered email address and we will send you a link to reset your password.
                    </span>
                </div>

                <button type='submit' disabled={isPending} className='btn-dark center mt-14'>

                    {
                        isPending ? 'Please wait...' : 'Send email'
                    }

                </button>
            </form>
        </div>

    )
}
