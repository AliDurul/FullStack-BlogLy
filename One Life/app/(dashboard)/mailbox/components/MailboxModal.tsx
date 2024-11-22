'use client'
import React, { FormEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { Email } from '@/types/types';
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectKycs } from '@/lib/features/kyc/kycSlice';
import { selectCategories } from '@/lib/features/category/categorySlice';
import { createTicket } from '@/lib/features/tickets/ticketAPI';
import { coloredToast } from '@/utils/sweetAlerts';
import { selectAsssignModal, setAssignModal, setStar } from '@/lib/features/email/emailSlice';


interface MailboxModalProps {
    ticketMailInfo: Email | null;
    // setStar: (mail: Email | null, assignIt?: boolean) => Promise<void>;
}

const MailboxModal = ({ ticketMailInfo }: MailboxModalProps) => {

    const dispatch = useAppDispatch();
    const agents = useAppSelector(selectKycs);
    const categories = useAppSelector(selectCategories);
    const assignModal = useAppSelector(selectAsssignModal);
    const [selectedAgent, setSelectedAgent] = useState<number | undefined>(undefined);

    const agentOp = agents.results?.map((kyc) => ({ label: kyc.first_name + " " + kyc.last_name, value: kyc.id }));
    // const categoryOp = categories.map((category) => ({ label: category.title, value: category.id }));

    const handleTicket = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const initialValues: {
            title: string | undefined;
            description: string | undefined;
            status: string;
            caller_email: string | undefined;
            email_id: string | undefined;
            priority: string;
            flag: string;
            cat: number;
            assigned_agent: number | undefined;
        } = {
            title: ticketMailInfo?.subject,
            email_id: ticketMailInfo?.id,
            description: ticketMailInfo?.body?.content,
            status: "Active",
            caller_email: ticketMailInfo?.sender?.emailAddress?.address,
            priority: "Medium",
            flag: "Moderate",
            cat: 5,
            assigned_agent: selectedAgent,
        }
        const res = await createTicket(initialValues);
        if (res.message) {
            dispatch(setStar({ mail: ticketMailInfo, assignIt: true }))
            // setStar(ticketMailInfo, true)
            dispatch(setAssignModal(false))
            coloredToast("success", res.message, "bottom-start");

        } else coloredToast("danger", res.error, "bottom-start");



    }


    return (
        <Transition appear show={assignModal} as={Fragment}>
            <Dialog as="div" open={assignModal} onClose={() => dispatch(setAssignModal(false))}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div id="slideIn_down_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                    <div className="flex items-start justify-center min-h-screen px-4">
                        <Dialog.Panel className="panel border-0 p-0 rounded-lg w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
                            <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                <h5 className="font-bold text-lg">Modal Title</h5>
                                <button onClick={() => dispatch(setAssignModal(false))} type="button" className="text-white-dark hover:text-dark">
                                    X
                                </button>
                            </div>
                            <form className="p-5" onSubmit={handleTicket}>
                                <div className="mb-5">
                                    <label htmlFor="phoneNo">Choose the Agent </label>
                                    <div className="flex justify-center items-center gap-2">
                                        <Select placeholder="Select The Number" options={agentOp}
                                            // value={agentOp.find(option => option.value === values.client_phonenumber)}
                                            onChange={option => { setSelectedAgent(option?.value) }}
                                            className='flex-1' required />
                                        {/* <UserModal setUserModal={setUserModal} userModal={userModal} /> */}
                                    </div>
                                </div>
                                {/* <div className={`mt-5 `}>
                                    <label htmlFor="cat">Category</label>
                                    <div className="flex justify-center items-center gap-2">
                                        <Select placeholder="Select The Category" options={categoryOp}
                                            value={categoryOp.find(option => option.value === values.cat)}
                                            onChange={option => { setFieldValue('cat', option ? option.value : ''); }}
                                            className='flex-1'
                                        />
                                    </div>
                                </div>
                                <div className={`mb-5 `}>
                                    <label htmlFor="flag">Flag</label>
                                    <input type='select' name='flag' id="flag" className="form-select" required  >
                                        <option value="">Select Flag...</option>
                                        <option value="Important">Important</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Least Important">Least Important</option>
                                        <option value="Prank">Prank</option>
                                    </input>
                                </div> */}
                                {/*  <div className="flex mb-5 gap-3 w-full">
                                    <div className={`flex-1 `}>
                                        <label htmlFor="status">Status</label>
                                        <input type='select' id='status' name='status' className="form-select" required >
                                            <option value="">Select Status...</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Active">Active</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </input>
                                     
                                    </div>
                                    <div className={`flex-1`}>
                                        <label htmlFor="priority">Priority</label>
                                        <input type='select' id="priority" name='priority' className="form-select" required >
                                            <option value="">Select Priority...</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">low</option>
                                            <option value="Critical">Critical</option>
                                        </input>
                                     
                                    </div>
                                </div> */}
                                <div className="flex justify-end items-center mt-8">
                                    <button onClick={() => dispatch(setAssignModal(false))} type="button" className="btn btn-outline-danger">
                                        Discard
                                    </button>
                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                        Create Ticket
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default MailboxModal

