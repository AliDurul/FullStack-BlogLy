import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ReactQuill from 'react-quill';
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllKycAsync, selectKycs } from '@/lib/features/kyc/kycSlice';
import Select from 'react-select';
import { createTask, updateTask } from '@/lib/features/task/taskAPI';
import { coloredToast } from '@/utils/sweetAlerts';
import { fetchAllTasksAsync } from '@/lib/features/task/taskSlice';
import { AsignAgent, Kyc } from '@/types/types';
import { getAllKycs } from '@/lib/features/kyc/kycAPI';


interface TaskListModalProps {
    addTaskModal: boolean;
    setAddTaskModal: (value: boolean) => void;
    params: {
        id?: number;
        title: string;
        asign_agent: number | AsignAgent;
        tag: string;
        priority: string;
        description: string;
        descriptionText: string;
    };
    setParams: (value: any) => void;
}

const TaskAddEditModal = ({ addTaskModal, setAddTaskModal, setParams, params }: TaskListModalProps) => {

    const dispatch = useAppDispatch();
    const [agents, setAgents] = useState<Kyc[]>([])

    useEffect(() => {
        (() => {
            getAllKycs('Employee', '1', '100')
                .then((res) => setAgents(res.results))
        })()
    }, [])


    const agentOp = agents?.map((kyc) => ({ label: kyc.first_name + " " + kyc.last_name, value: kyc.id }));

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const saveTask = async () => {
        if (!params.title) {
            showMessage('Title is required.', 'error');
            return false;
        }
        if (params.id) {
            // setParams({ ...params, asign_agent: typeof params.asign_agent === 'object' ? params.asign_agent?.id : params.asign_agent })

            const res = await updateTask({ ...params, asign_agent: typeof params.asign_agent === 'object' ? params.asign_agent?.id : params.asign_agent })
            if (res.message) {
                dispatch(fetchAllTasksAsync({}))
                coloredToast('success', res.message);
            } else {
                coloredToast('error', res.error);
            }

        } else {
            const res = await createTask(params)
            if (res.message) {
                dispatch(fetchAllTasksAsync({}))
                coloredToast('success', res.message);
            }
            else coloredToast('error', res.error);
        }
        // showMessage('Task has been saved successfully.');
        setAddTaskModal(false);
    };

    useEffect(() => {
        dispatch(fetchAllKycAsync({ type: 'Agent' }));
    }, [])


    return (
        <Transition appear show={addTaskModal} as={Fragment}>
            <Dialog as="div" open={addTaskModal} onClose={() => setAddTaskModal(false)} className="relative z-50">
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
                                    onClick={() => setAddTaskModal(false)}
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
                                    {params.id ? 'Edit Task' : 'Add Task'}
                                </div>
                                <div className="p-5">
                                    <form>
                                        <div className="mb-5">
                                            <label htmlFor="title">Title</label>
                                            <input id="title" type="text" placeholder="Enter Task Title" className="form-input" value={params.title} onChange={(e) => changeValue(e)} />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="asign_agent">Assignee</label>
                                            <Select placeholder="Select The Agent" options={agentOp}
                                                value={agentOp?.find(option => option.value === (typeof params.asign_agent === 'object' ? params.asign_agent?.id : params.asign_agent))}
                                                onChange={option => { setParams({ ...params, asign_agent: option?.value }) }}
                                                className='flex-1' />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="priority">Priority</label>
                                            <select id="priority" className="form-select" value={params.priority} onChange={(e) => changeValue(e)}>
                                                <option value="">Select Priority</option>
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                        <div className="mb-5">
                                            <label>Description</label>
                                            <ReactQuill
                                                theme="snow"
                                                value={params.description}
                                                defaultValue={params.description}
                                                onChange={(content, delta, source, editor) => {
                                                    params.description = content;
                                                    params.descriptionText = editor.getText();
                                                    setParams({
                                                        ...params,
                                                    });
                                                }}
                                                style={{ minHeight: '200px' }}
                                            />
                                        </div>
                                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setAddTaskModal(false)}>
                                                Cancel
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => saveTask()}>
                                                {params.id ? 'Update' : 'Add'}
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
    )
}

export default TaskAddEditModal