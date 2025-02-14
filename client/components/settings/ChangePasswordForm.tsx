'use client';
import React, { useActionState, useEffect } from 'react'
import InputBox from '../auth/InputBox';
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
        <form action={action}>
            <h1 className='max-md:hidden'>Change Password</h1>
            <div className='py-10 w-full md:max-w-[400px]'>
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
                <button className='btn-dark px-10' type='submit' disabled={isPending}>
                    {
                        isPending ? 'Updating ...' : 'Change Password'
                    }
                </button>

            </div>
        </form>
    )
}
