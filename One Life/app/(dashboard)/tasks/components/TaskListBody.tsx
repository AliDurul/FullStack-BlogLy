import React, { useState } from 'react'
import Dropdown from '@/app/components/Layout/Dropdown';
import { deleteTask, updateTask } from '@/lib/features/task/taskAPI';
import { coloredToast } from '@/utils/sweetAlerts';
import { useAppDispatch } from '@/lib/hooks';
import { updateTasks } from '@/lib/features/task/taskSlice';
import { formatDate } from '@/utils/helperFunctions';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Task } from '@/types/types';

interface TaskListBodyProps {
    pagedTasks: Task[]
    filteredTasks: any[];
    selectedTab: string;
    setSelectedTask: (value: any) => void;
    setViewTaskModal: (value: boolean) => void;
    searchTasks: (value: boolean) => void;
    addEditTask: (value: any) => void;

}

const TaskListBody = ({ pagedTasks, filteredTasks, selectedTab, setSelectedTask, setViewTaskModal, searchTasks, addEditTask }: TaskListBodyProps) => {

    const IMG_URL = 'http://192.168.1.111:8000'

    const [isPriorityMenu] = useState<any>(null);
    const dispatch = useAppDispatch()

    const setPriority = (task: any, name: string = '') => {
        let item = filteredTasks.find((d: any) => d.id === task.id);
        item.priority = name;
        searchTasks(false);
    };


    const taskCompleted = async (task: any = null) => {
        let itemIndex = filteredTasks.findIndex((d: any) => d.id === task.id);
        if (itemIndex !== -1) {
            let updatedItem = { ...filteredTasks[itemIndex] };
            updatedItem.status = updatedItem.status === 'Completed' ? 'In Progress' : 'Completed';
            const payload = {
                id: updatedItem.id,
                status: updatedItem.status
            };
            const res = await updateTask(payload);
            if (!res.error) {
                filteredTasks[itemIndex] = updatedItem;
                dispatch(updateTasks(filteredTasks))
                coloredToast('success', res.message)
            } else coloredToast('danger', res.error)
            searchTasks(false);
        }
    };

    const viewTask = (item: any = null) => {
        setSelectedTask(item);
        setTimeout(() => {
            setViewTaskModal(true);
        });
    };

    const handleDeleteTask = async (task: any, type: string = '') => {
        if (type === 'delete') {
            const res = await deleteTask(task.id);
            if (!res.error) {
                coloredToast('success', res.message);
                dispatch(updateTasks(res.remainingData))
                searchTasks(false);
            } else coloredToast('danger', res.error)
        }
        // if (type === 'deletePermanent') {
        //     setAllTasks(tasks.filter((d: any) => d.id !== task.id));
        // } else if (type === 'restore') {
        //     task.status = '';
        // }
        searchTasks(false);
    };
    return (
        <div className="table-responsive min-h-[400px] grow overflow-y-auto sm:min-h-[300px]">
            <table className="table-hover">
                <tbody>
                    {pagedTasks.map((task: Task) => {
                        return (
                            <tr className={`group cursor-pointer ${task.status === 'Completed' ? 'bg-white-light/30 dark:bg-[#1a2941] ' : ''}`} key={task.id}>
                                <td className="w-1">
                                    <input
                                        type="checkbox"
                                        id={`chk-${task.id}`}
                                        className="form-checkbox"
                                        disabled={selectedTab === 'trash'}
                                        onClick={() => taskCompleted(task)}
                                        defaultChecked={task.status === 'Completed'}
                                    />
                                </td>
                                <td>
                                    <div onClick={() => viewTask(task)}>
                                        <div className={`whitespace-nowrap text-base font-semibold group-hover:text-primary ${task.status === 'Completed' ? 'line-through' : ''}`}>
                                            {task.title}
                                        </div>
                                        <div className={`min-w-[300px] overflow-hidden text-white-dark line-clamp-1 ${task.status === 'Completed' ? 'line-through' : ''}`} dangerouslySetInnerHTML={{
                                            __html: task.description,
                                        }} />
                                    </div>
                                </td>
                                <td className="w-1">
                                    <div className="flex items-center space-x-2 ltr:justify-end rtl:justify-start rtl:space-x-reverse">
                                        {task.priority && (
                                            <div className="dropdown">
                                                <Dropdown
                                                    offset={[0, 5]}
                                                    placement='bottom-end'
                                                    btnClassName="align-middle"
                                                    button={
                                                        <span
                                                            className={`badge rounded-full capitalize hover:top-0 hover:text-white ${task.priority === 'Medium'
                                                                ? 'badge-outline-success  hover:bg-green-600'
                                                                : task.priority === 'Low'
                                                                    ? 'badge-outline-warning hover:bg-warning'
                                                                    : task.priority === 'High'
                                                                        ? 'badge-outline-danger hover:bg-danger'
                                                                        : task.priority === 'Medium' && isPriorityMenu === task.id
                                                                            ? 'bg-green-600 text-white'
                                                                            : task.priority === 'Low' && isPriorityMenu === task.id
                                                                                ? 'bg-warning text-white'
                                                                                : task.priority === 'High' && isPriorityMenu === task.id
                                                                                    ? 'bg-danger text-white'
                                                                                    : ''
                                                                }`}
                                                        >
                                                            {task.priority}
                                                        </span>
                                                    }
                                                >
                                                    <ul className="text-medium text-sm">
                                                        <li>
                                                            <button type="button" className="text-danger ltr:text-left rtl:text-right" onClick={() => setPriority(task, 'High')}>
                                                                High
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" className="text-primary ltr:text-left rtl:text-right" onClick={() => setPriority(task, 'Medium')}>
                                                                Medium
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button type="button" className="text-warning ltr:text-left rtl:text-right" onClick={() => setPriority(task, 'Low')}>
                                                                Low
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </Dropdown>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="w-1">
                                    <p className={`whitespace-nowrap font-medium text-white-dark ${task.status === 'Completed' ? 'line-through' : ''}`}>{formatDate(task.created_at, true)}</p>
                                </td>
                                <td className="w-1">
                                    <div className="flex w-max items-center justify-between">
                                        <div className="flex-shrink-0 ltr:mr-2.5 rtl:ml-2.5">
                                            {task.asign_agent.profile_pic && (
                                                <Tippy content={`${task.asign_agent.first_name} ${task.asign_agent.last_name}`} theme="" >

                                                    <div>
                                                        <img src={IMG_URL + task.asign_agent.profile_pic} className="h-8 w-8 rounded-full object-cover" alt="avatar" />
                                                    </div>
                                                </Tippy>

                                            )}
                                            {!task.asign_agent.profile_pic && task.asign_agent ? (
                                                <Tippy content={`${task.asign_agent.first_name} ${task.asign_agent.last_name}`} theme="" >
                                                    <div className="grid h-8 w-8 place-content-center rounded-full bg-primary text-sm font-semibold text-white">
                                                        {task.asign_agent.first_name.charAt(0) + '' + task.asign_agent.last_name.charAt(0)}
                                                    </div>
                                                </Tippy>
                                            ) : (
                                                ''
                                            )}
                                            {/* {!task.asign_agent.profile_pic && !task.asign_agent ? (
                                                <div className="grid h-8 w-8 place-content-center rounded-full border border-gray-300 dark:border-gray-800">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5">
                                                        <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                        <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                ''
                                            )} */}
                                        </div>
                                        <div className="dropdown">
                                            <Dropdown
                                                offset={[0, 5]}
                                                placement='bottom-end'
                                                btnClassName="align-middle"
                                                button={
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90 opacity-70">
                                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                }
                                            >
                                                <ul className="whitespace-nowrap">
                                                    {selectedTab !== 'trash' && (
                                                        <>
                                                            <li>
                                                                <button type="button" onClick={() => addEditTask(task)}>
                                                                    <svg
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4.5 w-4.5 ltr:mr-2 rtl:ml-2"
                                                                    >
                                                                        <path opacity="0.5" d="M4 22H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                        <path
                                                                            d="M14.6296 2.92142L13.8881 3.66293L7.07106 10.4799C6.60933 10.9416 6.37846 11.1725 6.17992 11.4271C5.94571 11.7273 5.74491 12.0522 5.58107 12.396C5.44219 12.6874 5.33894 12.9972 5.13245 13.6167L4.25745 16.2417L4.04356 16.8833C3.94194 17.1882 4.02128 17.5243 4.2485 17.7515C4.47573 17.9787 4.81182 18.0581 5.11667 17.9564L5.75834 17.7426L8.38334 16.8675L8.3834 16.8675C9.00284 16.6611 9.31256 16.5578 9.60398 16.4189C9.94775 16.2551 10.2727 16.0543 10.5729 15.8201C10.8275 15.6215 11.0583 15.3907 11.5201 14.929L11.5201 14.9289L18.3371 8.11195L19.0786 7.37044C20.3071 6.14188 20.3071 4.14999 19.0786 2.92142C17.85 1.69286 15.8581 1.69286 14.6296 2.92142Z"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                        />
                                                                        <path
                                                                            opacity="0.5"
                                                                            d="M13.8879 3.66406C13.8879 3.66406 13.9806 5.23976 15.3709 6.63008C16.7613 8.0204 18.337 8.11308 18.337 8.11308M5.75821 17.7437L4.25732 16.2428"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                        />
                                                                    </svg>
                                                                    Edit
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button type="button" onClick={() => handleDeleteTask(task, 'delete')}>
                                                                    <svg
                                                                        className="ltr:mr-2 rtl:ml-2"
                                                                        width="20"
                                                                        height="20"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            opacity="0.5"
                                                                            d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                            strokeLinecap="round"
                                                                        />
                                                                        <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                        <path
                                                                            d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                            strokeLinecap="round"
                                                                        />
                                                                        <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                        <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    </svg>
                                                                    Delete
                                                                </button>
                                                            </li>
                                                        </>
                                                    )}
                                                </ul>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TaskListBody