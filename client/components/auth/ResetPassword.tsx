'use client';
import React, { useActionState, useEffect } from 'react'
import InputBox from '../shared/InputBox'
import { resetPassword } from '@/lib/actions/authActions';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ResetPassword() {

    const searchParams = useSearchParams();
    const resetPassToken = searchParams.get("resetPassToken");

    const [state, action, isPending] = useActionState(resetPassword, null);

    const router = useRouter();

    useEffect(() => {
        if (!state?.message) return;

        toast[state.success ? 'success' : 'error'](state.message);

        if (state.success) {
            const timer = setTimeout(() => router.replace("/auth/sign-in"), 1000);
            return () => clearTimeout(timer);
        }
    }, [state, router]);

    return (
        <div className='w-[80%] max-w-[400px]'>
            <form action={action}>
                <h1 className='text-4xl font-gelasio capitalize text-center mb-14'>
                    Create New Password
                </h1>

                <InputBox
                    name="password"
                    type="password"
                    placeholder="Password"
                    icon="fi-rr-key"
                    errors={state?.errors?.password}
                    value={state?.inputs?.password as string}
                />

                <input type="hidden" name="resetPassToken" value={resetPassToken || ''} />

                <div className='mt-5 text-center text-dark-grey text-xl'>
                    <span>
                        Enter your new password above to reset your account password.
                    </span>
                </div>

                <button type='submit' disabled={isPending} className='btn-dark center mt-14'>

                    {
                        isPending ? 'Please wait...' : 'Reset Password'
                    }

                </button>
            </form>
        </div>

    )
}
