'use client';
import React, { useActionState, useEffect } from 'react'
import InputBox from '../shared/InputBox';
import toast from 'react-hot-toast';
import { changePassword } from '@/lib/actions/userActions';

export default function ChangePasswordForm() {

    const [state, action, isPending] = useActionState(changePassword, null)

    useEffect(() => {

        if (state) {
            toast[state?.success ? 'success' : 'error'](state?.message);
        }

    }, [state])


    return (
        <form action={action} className='flex flex-col items-center justify-center w-[80%] max-w-[400px] mx-auto h-full'>
            <h1 className='text-3xl font-gelasio capitalize text-center mt-12'>
                Change Your Password
            </h1>
            <div className='py-10 flex flex-col gap-5 w-full '>
                <InputBox
                    name='currentPassword'
                    type='password'
                    placeholder='Current Password'
                    icon='fi-rr-unlock'
                    errors={state?.errors?.currentPassword}
                    value={state?.inputs?.currentPassword as string}

                // className='profile-edit-input'
                />
                <InputBox
                    name='newPassword'
                    type='password'
                    placeholder='New Password'
                    icon='fi-rr-unlock'
                    errors={state?.errors?.newPassword}
                    value={state?.inputs?.newPassword as string}
                // className='profile-edit-input'
                />
                <button className='btn-dark px-4' type='submit' disabled={isPending}>
                    {
                        isPending ? 'Updating ...' : 'Change Password'
                    }
                </button>

            </div>
        </form>
    )
}
