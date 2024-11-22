'use client';
import React, { SetStateAction } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import MaskedInput from 'react-text-mask';
import { PlusIcon } from '@/app/icons';
import { coloredToast } from '@/utils/sweetAlerts';
import { fetchAllCategoryAsync } from '@/lib/features/category/categorySlice';
import { useAppDispatch } from '@/lib/hooks';
import { createKyc } from '@/lib/features/kyc/kycAPI';
import { fetchAllKycAsync, updateKycs } from '@/lib/features/kyc/kycSlice';

interface userModalProps {
    setUserModal: (value: boolean) => void;
    userModal: boolean;


}

export default function UserModal({ setUserModal, userModal, }: userModalProps) {
    const dispatch = useAppDispatch();

    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [phone_number, setPhoneNumber] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const values = { first_name, last_name, phone_number }
        const res = await createKyc(values);

        if (!res.error) {
            coloredToast("success", 'Successfuly Created', "bottom-start");
            setUserModal(false);
            setFirstName('');
            setPhoneNumber('');
            setLastName('');
            dispatch(updateKycs(res))
        } else {
            coloredToast("danger", res.error, "bottom-start");
        }

    }

    return (
        <div>
            <button onClick={() => setUserModal(true)} type="button" className="btn btn-outline-primary btn-sm">
                <PlusIcon />
            </button>
            <Transition appear show={userModal} as={Fragment}>
                <Dialog as="div" open={userModal} onClose={() => setUserModal(false)}>
                    <div id="slidein_up_modal" className="fixed inset-0 bg-[black]/30 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-32 text-black dark:text-white-dark animate__animated animate__slideInUp">
                                <div className=" bg-[#fbfbfb] dark:bg-[#121c2c]  px-5 py-3">
                                    <h5 className="font-bold text-lg">Create New User</h5>
                                </div>
                                <form className="p-3" >
                                    <div className="flex gap-3">
                                        <div className='flex-1'>
                                            <label htmlFor="first_name" >First Name</label>
                                            <input
                                                value={first_name}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                id="first_name" name='first_name' type="text" placeholder="Enter FirstName"
                                                className={`form-input `} required />
                                        </div>
                                        <div className='flex-1'>
                                            <label htmlFor="last_name" >Last Name</label>
                                            <input
                                                value={last_name}
                                                onChange={(e) => setLastName(e.target.value)}
                                                id="last_name" name='last_name' type="text" placeholder="Enter LastName"
                                                className={`form-input `} />
                                        </div>
                                    </div>
                                    <fieldset className="mt-4">
                                        <label htmlFor="phoneNo" className='text-sm'>
                                            Client Phone Number
                                        </label>
                                        <MaskedInput
                                            id="phoneNo"
                                            name='client_phonenumber'
                                            type="text"
                                            placeholder="+___-___-___-___"
                                            className={`form-input `}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required
                                            mask={[
                                                '+',
                                                /\d/, /\d/, /\d/, // Allow up to three digits for the country code
                                                '-',
                                                /\d/, /\d/, /\d/, // First group of three digits
                                                '-',
                                                /\d/, /\d/, /\d/, // Second group of three digits
                                                '-',
                                                /\d/, /\d/, /\d/  // Third group of three digits
                                            ]}
                                        />

                                    </fieldset>

                                    <div className="flex justify-end items-center mt-8">
                                        <button onClick={() => setUserModal(false)} type="button" className="btn btn-outline-danger">
                                            Discard
                                        </button>
                                        <button onClick={handleSubmit} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
