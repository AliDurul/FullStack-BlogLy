'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import MaskedInput from 'react-text-mask';
import { Ticket } from '@/types/types';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { coloredToast } from '@/utils/sweetAlerts';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllTicketAsync, selectTicket, selectTicketModal, setTicketModal, updateTicketState } from '@/lib/features/tickets/ticketSlice';
import { createTicket, updateTicket } from '@/lib/features/tickets/ticketAPI';
import { number, object, string } from 'yup';
import { fetchAllCategoryAsync, selectCategories } from '@/lib/features/category/categorySlice';
import CategoryModal from './CategoryModal';
import Select from 'react-select';
import { fetchAllKycAsync, selectKycs } from '@/lib/features/kyc/kycSlice';
import UserModal from './UserModal';
import { C } from '@fullcalendar/core/internal-common';


const baseTicketSchema = object({
    title: string().required("Title is required."),
    description: string().required("Description is required."),
    client_phonenumber: number().required("Client Phone Number is required."),
    flag: string().required("Flag is required."),
    // cat: required("Category is required."),
});

function getTicketSchema(params: any) {
    return baseTicketSchema.shape({
        status: params.id ? string().required("Status is required.") : string(),
        priority: params.id ? string().required("Priority is required.") : string(),
    });
}

export default function TicketModal() {
    const dispatch = useAppDispatch();

    const kycs = useAppSelector(selectKycs);
    const categories = useAppSelector(selectCategories);
    const ticketModal = useAppSelector(selectTicketModal);
    const params = useAppSelector(selectTicket);
    const [categoryModal, setCategoryModal] = useState(false)
    const [userModal, setUserModal] = useState(false)
    const [isOwn, setIsOwn] = useState<boolean>(false)


    const phoneOp = kycs.results?.map((kyc) => ({ label: kyc.phone_number, value: kyc.id }));
    // @ts-ignore //!
    const categoryOp = categories.results?.map((category) => ({ label: category.title, value: category.id }));


    useEffect(() => {
        dispatch(fetchAllKycAsync({ type: 'Customer' }));
        dispatch(fetchAllCategoryAsync({}))
    }, []);


    const initialValues = {
        id: params?.ticket_id || 0,
        title: params?.title || "",
        description: params?.description || "",
        client_phonenumber: typeof params.client_phonenumber === 'number' ? params.client_phonenumber : params?.client_phonenumber?.id || 0,
        caller_phonenumber: params?.caller_phonenumber || "",
        flag: params?.flag || "",
        cat: params?.cat || 0,
        priority: params?.priority || "Medium",
        status: params?.status || "Active",
    }
    const validationSchema = getTicketSchema(params);


    return (
        <div>

            <Transition appear show={ticketModal} as={Fragment}>
                <Dialog as="div" open={ticketModal} onClose={() => { dispatch(setTicketModal(false)) }} className="relative z-50">

                    <div className="fixed inset-0 bg-[black]/60 overflow-y-auto">
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
                                        onClick={() => { dispatch(setTicketModal(false)) }}
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
                                        {params && 'id' in params ? 'Edit Ticket' : 'Create Ticket'}
                                    </div>
                                    <div className="p-5">
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={validationSchema}

                                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                                if ((params as Ticket).ticket_id) {
                                                    //@ts-ignore
                                                    const { assigned_agent, ...newValue } = values;
                                                    const res = await updateTicket(newValue);
                                                    if (res.message) {
                                                        coloredToast("success", res.message, "bottom-start");
                                                        dispatch(setTicketModal(false));
                                                        dispatch(updateTicketState({ ...res.data, cat: res.data.cat.id }))
                                                        dispatch(fetchAllTicketAsync({}));
                                                    } else {
                                                        coloredToast("danger", res.error, "bottom-start");
                                                    }
                                                } else {
                                                    //@ts-ignore
                                                    // values.cat = values.cat.id;

                                                    const res = await createTicket(values);
                                                    setTimeout(() => {
                                                        setSubmitting(false);
                                                        if (res.message) {
                                                            coloredToast("success", res.message, "bottom-start");
                                                            dispatch(setTicketModal(false));
                                                            dispatch(fetchAllTicketAsync({}));
                                                        } else {
                                                            coloredToast("danger", res.error, "bottom-start");
                                                        }
                                                    }, 500);
                                                }
                                            }}
                                        >
                                            {
                                                ({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, }) => (
                                                    <Form onSubmit={handleSubmit} >
                                                        <div className=" flex mb-1">
                                                            <div className='w-24 '>
                                                                <label htmlFor="" className='text-zinc-600 text-sm '>Add Caller</label>
                                                                <div className="">
                                                                    <label className="w-12 h-5 relative">
                                                                        <input type="checkbox" checked={isOwn === true} onChange={() => setIsOwn(!isOwn)} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
                                                                        <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-3 before:h-3 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            {
                                                                isOwn && (
                                                                    <fieldset className="ml-auto">
                                                                        <label htmlFor="phoneNo" className='text-sm'>
                                                                            Caller Phone Number
                                                                            {/* (<span className="text-white-dark">+###-###-###-###</span>) */}
                                                                        </label>
                                                                        <Field
                                                                            as={MaskedInput}
                                                                            id="phoneNo"
                                                                            name='caller_phonenumber'
                                                                            type="text"
                                                                            placeholder="+___-___-___-___"
                                                                            className={`form-input ${touched.caller_phonenumber && errors.caller_phonenumber ? "border-red-500" : ""}`}
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
                                                                        <ErrorMessage
                                                                            name='caller_phonenumber'
                                                                            component="div"
                                                                            className="text-red-500 text-sm mt-1 "
                                                                        />
                                                                    </fieldset>
                                                                )
                                                            }
                                                        </div>
                                                        <div className={`mb-5 ${touched.client_phonenumber && errors.client_phonenumber ? "has-error" : ""}`}>
                                                            <label htmlFor="phoneNo">Client Phone Number </label>
                                                            <div className="flex justify-center items-center gap-2">
                                                                <Select placeholder="Select The Number" options={phoneOp}
                                                                    value={phoneOp.find(option => option.value === values.client_phonenumber)}
                                                                    onChange={option => { setFieldValue('client_phonenumber', option ? option.value : '') }}
                                                                    className='flex-1' />
                                                                <UserModal setUserModal={setUserModal} userModal={userModal} />
                                                            </div>
                                                            <ErrorMessage
                                                                name="client_phonenumber"
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1 "
                                                            />
                                                        </div>

                                                        <div className="mb-5">
                                                            <label htmlFor="title">Title</label>
                                                            <Field
                                                                id="title" name='title' type="text" placeholder="Enter Title"
                                                                className={`form-input ${touched.title && errors.title ? "border-red-500" : ""}`} required />
                                                            <ErrorMessage
                                                                name="title"
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1 "
                                                            />
                                                        </div>
                                                        <div className={`mt-5 ${touched.cat && errors.cat ? "has-error" : ""}`}>
                                                            <label htmlFor="cat">Category</label>
                                                            <div className="flex justify-center items-center gap-2">
                                                                <Select placeholder="Select The Category" options={categoryOp}
                                                                    value={categoryOp?.find((option: any) => option.value === values.cat)}
                                                                    onChange={option => { setFieldValue('cat', option ? option.value : ''); }}
                                                                    className='flex-1'
                                                                />
                                                                <CategoryModal setCategoryModal={setCategoryModal} categoryModal={categoryModal} />
                                                            </div>
                                                            <ErrorMessage
                                                                name="cat"
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1 "
                                                            />
                                                        </div>
                                                        <div className={`mb-5 ${touched.flag && errors.flag ? "has-error" : ""}`}>
                                                            <label htmlFor="flag">Flag</label>
                                                            <Field as='select' name='flag' id="flag" className="form-select" required  >
                                                                <option value="">Select Flag...</option>
                                                                <option value="Important">Important</option>
                                                                <option value="Moderate">Moderate</option>
                                                                <option value="Least Important">Least Important</option>
                                                                <option value="Prank">Prank</option>
                                                            </Field>
                                                            <ErrorMessage
                                                                name="flag"
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1 "
                                                            />
                                                        </div>
                                                        <div className="flex mb-5 gap-3 w-full">
                                                            <div className={`flex-1 ${touched.status && errors.status ? "has-error" : ""}`}>
                                                                <label htmlFor="status">Status</label>
                                                                <Field as='select' id='status' name='status' className="form-select" required >
                                                                    <option value="">Select Status...</option>
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Active">Active</option>
                                                                    <option value="Resolved">Resolved</option>
                                                                    <option value="Cancelled">Cancelled</option>
                                                                </Field>
                                                                <ErrorMessage
                                                                    name="status"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                            <div className={`flex-1 ${touched?.priority && errors?.priority ? "has-error" : ""}`}>
                                                                <label htmlFor="priority">Priority</label>
                                                                <Field as='select' id="priority" name='priority' className="form-select" required >
                                                                    <option value="">Select Priority...</option>
                                                                    <option value="High">High</option>
                                                                    <option value="Medium">Medium</option>
                                                                    <option value="Low">low</option>
                                                                    <option value="Critical">Critical</option>
                                                                </Field>
                                                                <ErrorMessage
                                                                    name="priority"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className={`flex`}>
                                                                <div className='bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] whitespace-nowrap '>
                                                                    Description
                                                                </div>
                                                                <Field as="textarea" name='description' rows={4} className={` ${touched.description && errors.description ? "border-red-500" : ""} form-textarea ltr:rounded-l-none rtl:rounded-r-none`}></Field>
                                                            </div>
                                                            <ErrorMessage
                                                                name="description"
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1 "
                                                            />
                                                        </div>
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" className="btn btn-outline-danger gap-2" onClick={() => dispatch(setTicketModal(false))}>
                                                                Cancel
                                                            </button>
                                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                                {(params as Ticket).ticket_id ? 'Update Ticket' : 'Create Ticket'}
                                                            </button>
                                                        </div>
                                                    </Form>
                                                )
                                            }


                                        </Formik>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog >
            </Transition >
        </div >
    )
}
