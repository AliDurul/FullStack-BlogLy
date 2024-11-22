'use client'
import React from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllFaqAsync, selectFaq, selectFaqModal, setFaqModal } from '@/lib/features/faq/faqSlice';
import { coloredToast } from '@/utils/sweetAlerts';
import { createFaq, updateFaq } from '@/lib/features/faq/faqAPI';



export default function FaqModal() {
    const dispatch = useAppDispatch();
    const faqModal = useAppSelector(selectFaqModal)
    const faq = useAppSelector(selectFaq)
    const [initialValues, setinitialValues] = useState(faq)

    useEffect(() => {
        setinitialValues(faq)
    }, [faq])

    const addQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (initialValues.question.trim().length < 10 || initialValues.answer.trim().length < 10) {
            coloredToast("danger", "Question and Answer must be at least 10 characters long");
            return
        }

        if (faq.id) {
            const res = await updateFaq(initialValues)
            if (res.message) {
                coloredToast("success", res.message, "bottom-start");
                dispatch(setFaqModal(false))
                dispatch(fetchAllFaqAsync({}));
            } else {
                coloredToast("danger", res.error, "bottom-start");
            }
        } else {
            const res = await createFaq(initialValues);
            setTimeout(() => {
                if (res.message) {
                    coloredToast("success", res.message, "bottom-start");
                    dispatch(setFaqModal(false))
                    dispatch(fetchAllFaqAsync({}));
                } else {
                    coloredToast("danger", res.error, "bottom-start");
                }
            }, 500);
        }

    };

    return (
        <>
            <Transition appear show={faqModal} as={Fragment}>
                <Dialog as="div" open={faqModal} onClose={() => dispatch(setFaqModal(false))} className="relative z-50">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => dispatch(setFaqModal(false))}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                        Add New Question
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={addQuestion}>
                                            <div className="mb-5">
                                                <label htmlFor="question">Question</label>
                                                <input id="question"
                                                    type="text"
                                                    placeholder="Enter Question"
                                                    className="form-input"
                                                    onChange={(e) => setinitialValues({ ...initialValues, question: e.target.value })}
                                                    value={initialValues.question} />
                                            </div>


                                            <div className="mb-5">
                                                <label htmlFor="desc">Answer</label>
                                                <textarea
                                                    id="desc"
                                                    rows={3}
                                                    className="form-textarea min-h-[130px] resize-none"
                                                    placeholder="Enter Answer"
                                                    onChange={(e) => setinitialValues({ ...initialValues, answer: e.target.value })}
                                                    value={initialValues.answer}
                                                ></textarea>
                                            </div>
                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger gap-2" onClick={() => dispatch(setFaqModal(false))}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" >
                                                    Add Question
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>

    )
}
