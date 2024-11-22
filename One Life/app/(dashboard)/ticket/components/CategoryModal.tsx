'use client';
import React, { SetStateAction } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { PlusIcon } from '@/app/icons';
import { title } from 'process';
import { createCategory } from '@/lib/features/category/categoryAPI';
import { coloredToast } from '@/utils/sweetAlerts';
import { fetchAllCategoryAsync } from '@/lib/features/category/categorySlice';
import { useAppDispatch } from '@/lib/hooks';
import { Ticket } from '@/types/types';

interface categoryModalProps {
    setCategoryModal: (value: boolean) => void;
    categoryModal: boolean;


}

export default function CategoryModal({ setCategoryModal, categoryModal, }: categoryModalProps) {
    const dispatch = useAppDispatch();

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const values = { title, description }
        const res = await createCategory(values);

        if (res.message) {
            setTitle('');
            setDescription('');
            coloredToast("success", res.message, "bottom-start");
            setCategoryModal(false);
            dispatch(fetchAllCategoryAsync({}));
        } else {
            coloredToast("danger", res.error, "bottom-start");
        }

    }

    return (
        <div>
            <button onClick={() => setCategoryModal(true)} type="button" className="btn btn-outline-primary btn-sm">
                <PlusIcon />
            </button>
            <Transition appear show={categoryModal} as={Fragment}>
                <Dialog as="div" open={categoryModal} onClose={() => setCategoryModal(false)}>
                    <div id="slidein_up_modal" className="fixed inset-0 bg-[black]/30 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInUp">
                                <div className=" bg-[#fbfbfb] dark:bg-[#121c2c]  px-5 py-3">
                                    <h5 className="font-bold text-lg">Create New Category</h5>
                                </div>
                                <form className="p-3" >
                                    <div>
                                        <label htmlFor="phoneNo" >
                                            Title
                                        </label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            id="title" name='title' type="text" placeholder="Enter Title"
                                            className={`form-input `} required />
                                    </div>
                                    <div>
                                        <label htmlFor="phoneNo" >
                                            Description
                                        </label>
                                        <input
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            id="description" name='description' type="text" placeholder="Enter Description"
                                            className={`form-input `} />
                                    </div>

                                    <div className="flex justify-end items-center mt-8">
                                        <button onClick={() => setCategoryModal(false)} type="button" className="btn btn-outline-danger">
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
