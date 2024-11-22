import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import 'react-quill/dist/quill.snow.css';
import { Task } from '@/types/types';

interface SelectedTaskProp {
    setViewTaskModal: (value: boolean) => void;
    viewTaskModal: boolean;
    selectedTask: Task
}

const SelectedTaskModal = ({ setViewTaskModal, viewTaskModal, selectedTask }: SelectedTaskProp) => {
    return (
        <Transition appear show={viewTaskModal} as={Fragment}>
            <Dialog as="div" open={viewTaskModal} onClose={() => setViewTaskModal(false)} className="relative z-50">
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
                                    onClick={() => setViewTaskModal(false)}
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
                                <div className="flex flex-wrap items-center gap-2 bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    <div>{selectedTask.title}</div>
                                    {selectedTask.priority && (
                                        <div
                                            className={`badge rounded-3xl capitalize ${selectedTask.priority === 'Medium'
                                                ? 'badge-outline-success'
                                                : selectedTask.priority === 'Low'
                                                    ? 'badge-outline-warning '
                                                    : selectedTask.priority === 'High'
                                                        ? 'badge-outline-danger '
                                                        : ''
                                                }`}
                                        >
                                            {selectedTask.priority}
                                        </div>
                                    )}
                                  {/*   {selectedTask.tag && (
                                        <div
                                            className={`badge rounded-3xl capitalize ${selectedTask.tag === 'team' ? 'badge-outline-success' : selectedTask.tag === 'update' ? 'badge-outline-info ' : ''
                                                }`}
                                        >
                                            {selectedTask.tag}
                                        </div>
                                    )} */}
                                </div>
                                <div className="p-5">
                                    <div
                                        className="text-base"
                                        dangerouslySetInnerHTML={{
                                            __html: selectedTask.description,
                                        }}
                                    ></div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setViewTaskModal(false)}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default SelectedTaskModal