'use client'
import { fetchAllFaqAsync, selectFaqs, setFaqModal, updateFaqState, updateFaqs } from '@/lib/features/faq/faqSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useEffect, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import FaqModal from './FaqModal';
import useDeleteToasts from '@/hooks/useDeleteToasts';
import { DeleteIcon, EditIcon } from '@/app/icons';
import { deleteFaq } from '@/lib/features/faq/faqAPI';


export default function FaqList() {

    const dispatch = useAppDispatch()
    const faqs = useAppSelector(selectFaqs)
    const { deleteToast } = useDeleteToasts();


    useEffect(() => {
        dispatch(fetchAllFaqAsync({}))
    }, [])

    const deleteRow = async (id: any = null) => {
        if (id) {
            deleteToast(id, deleteFaq, updateFaqs);
        }
    };

    const [active, setActive] = useState<Number>();
    const togglePara = (value: Number) => {
        setActive((oldValue) => {
            return oldValue === value ? 0 : value;
        });
    };
    return (
        <div className="pt-5">
            <div className='flex justify-between items-center max-w-[80%] mx-auto'>
                <h2 className="text-center text-xl font-bold md:text-3xl">
                    Frequently Asked <span className="text-primary">Questions</span>
                </h2>
                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => { dispatch(setFaqModal(true)), dispatch(updateFaqState({ question: '', answer: '' })) }}>
                    Add Question
                </button>
            </div>
            <div className="mt-5 space-y-5 max-w-[80%] mx-auto">
                {
                    faqs?.map((faq, index) => (
                        <div className="rounded-md border border-[#ebedf2] bg-white dark:border-[#191e3a] dark:bg-black ">
                            <div className={`flex cursor-pointer rounded-t-md p-5  font-semibold ${active === index + 1 ? 'bg-primary/20 text-black' : ''}`} onClick={() => togglePara(index + 1)}>
                                <span className="text-dark">{faq.question}</span>
                                <div className="flex  ltr:ml-auto rtl:mr-auto">
                                    <svg className={`h-5 w-5 ${active === index + 1 ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <AnimateHeight duration={300} height={active === index + 1 ? 'auto' : 0}>
                                <div className="flex items-center">
                                    <div className='p-3'>
                                        <button
                                            type="button"
                                            className="flex hover:text-info"
                                            onClick={() => {
                                                dispatch(updateFaqState(faq)),
                                                    dispatch(setFaqModal(true))
                                            }}
                                        >
                                            <EditIcon />
                                        </button>
                                        <button type="button" className="flex hover:text-danger mt-5" onClick={(e) => deleteRow(faq.id)}>
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                    <div className="p-5 font-semibold text-white-dark">
                                        <p>{faq.answer}</p>
                                    </div>

                                </div>
                            </AnimateHeight>
                        </div>
                    ))
                }
                <FaqModal />
            </div>
        </div>

    )
}
