'use client'
import { useState, useEffect, Fragment } from 'react';
import 'react-quill/dist/quill.snow.css';
import SelectedTaskModal from './SelectedTaskModal'
import TaskSidebar from './TaskSidebar';
import TaskListBody from './TaskListBody';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllTasksAsync, selectTasks } from '@/lib/features/task/taskSlice';
import TaskAddEditModal from './TaskAddEditModal';


const TasklistMain = () => {
    const dispatch = useAppDispatch();

    const tasks = useAppSelector(selectTasks)

    useEffect(() => {
        dispatch(fetchAllTasksAsync({}))
    }, [])

    interface DefaultParams {
        id?: number | null;
        title: string;
        description: string;
        asign_agent: number | null;
        descriptionText: string;
        priority: string,
    }

    const defaultParams: DefaultParams = {
        // id: null,
        title: '',
        description: '',
        descriptionText: '',
        asign_agent: null,
        priority: 'Medium',
    };

    const [selectedTab, setSelectedTab] = useState('');
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [viewTaskModal, setViewTaskModal] = useState(false);
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const [filteredTasks, setFilteredTasks] = useState<any>(tasks.results);
    const [pagedTasks, setPagedTasks] = useState<any>(filteredTasks);
    const [searchTask, setSearchTask] = useState<any>('');
    const [selectedTask, setSelectedTask] = useState<any>(defaultParams);

    const [pager] = useState<any>({
        currentPage: 1,
        totalPages: 0,
        pageSize: 15,
        startIndex: 0,
        endIndex: 0,
    });

    useEffect(() => {
        setFilteredTasks(tasks.results);
        setPagedTasks(filteredTasks);
    }, [tasks])


    useEffect(() => {
        searchTasks();
    }, [selectedTab, searchTask, tasks]);



    const searchTasks = (isResetPage = true) => {
        if (isResetPage) {
            pager.currentPage = 1;
        }
        let res;
        if (selectedTab === 'Completed') {
            res = tasks.results?.filter((d) => d.status === selectedTab);
        } else if (selectedTab === 'High') {
            res = tasks.results?.filter((d) => d.priority === selectedTab);
        } else {
            res = tasks.results?.filter((d) => d.status !== 'trash');
        }

        if (selectedTab === 'High' || selectedTab === 'Medium' || selectedTab === 'Low') {
            res = res.filter((d) => d.priority === selectedTab);
        }
        setFilteredTasks([...res.filter((d: any) => d.title?.toLowerCase().includes(searchTask))]);
        getPager(res.filter((d: any) => d.title?.toLowerCase().includes(searchTask)));
    };

    const getPager = (res: any) => {
        setTimeout(() => {
            if (res.length) {
                pager.totalPages = pager.pageSize < 1 ? 1 : Math.ceil(res.length / pager.pageSize);
                if (pager.currentPage > pager.totalPages) {
                    pager.currentPage = 1;
                }
                pager.startIndex = (pager.currentPage - 1) * pager.pageSize;
                pager.endIndex = Math.min(pager.startIndex + pager.pageSize - 1, res.length - 1);
                setPagedTasks(res.slice(pager.startIndex, pager.endIndex + 1));
            } else {
                setPagedTasks([]);
                pager.startIndex = -1;
                pager.endIndex = -1;
            }
        });
    };


    const addEditTask = (task: any = null) => {
        setIsShowTaskMenu(false);
        let json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (task) {
            let json1 = JSON.parse(JSON.stringify(task));
            setParams(json1);
        }
        setAddTaskModal(true);
    };


    return (
        <div className="relative flex h-full gap-5 mt-4 sm:h-[calc(100vh_-_150px)]">
            {/* sidebar task */}
            <TaskSidebar
                isShowTaskMenu={isShowTaskMenu}
                selectedTab={selectedTab}
                setIsShowTaskMenu={setIsShowTaskMenu}
                setSelectedTab={setSelectedTab}
                tasks={tasks.results}
                addEditTask={addEditTask}
            />
            <div className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div>
            <div className="panel h-full flex-1 overflow-auto p-0">
                <div className="flex h-full flex-col">
                    <div className="flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-center">
                        <div className="flex items-center ltr:mr-3 rtl:ml-3">
                            <button type="button" className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden" onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                            <div className="group relative flex-1">
                                <input
                                    type="text"
                                    className="peer form-input ltr:!pr-10 rtl:!pl-10"
                                    placeholder="Search Task..."
                                    value={searchTask}
                                    onChange={(e) => setSearchTask(e.target.value)}
                                    onKeyUp={() => searchTasks()}
                                />
                                <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                                        <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:flex-auto sm:justify-end">
                            <p className="ltr:mr-3 rtl:ml-3">{pager.startIndex + 1 + '-' + (pager.endIndex + 1) + ' of ' + filteredTasks.length}</p>
                            <button
                                type="button"
                                disabled={pager.currentPage === 1}
                                className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 ltr:mr-3 rtl:ml-3 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                                onClick={() => {
                                    pager.currentPage--;
                                    searchTasks(false);
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:rotate-180">
                                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                disabled={pager.currentPage === pager.totalPages}
                                className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                                onClick={() => {
                                    pager.currentPage++;
                                    searchTasks(false);
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rtl:rotate-180">
                                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                    {pagedTasks.length ? (
                        <TaskListBody
                            pagedTasks={pagedTasks}
                            filteredTasks={filteredTasks}
                            selectedTab={selectedTab}
                            setSelectedTask={setSelectedTask}
                            setViewTaskModal={setViewTaskModal}
                            searchTasks={searchTasks}
                            addEditTask={addEditTask}
                        />
                    ) : (
                        <div className="flex h-full min-h-[400px] items-center justify-center text-lg font-semibold sm:min-h-[300px]">No data available</div>
                    )}
                </div>
            </div>
            {/* create task */}
            <TaskAddEditModal addTaskModal={addTaskModal} setAddTaskModal={setAddTaskModal} setParams={setParams} params={params} />
            {/* selected task */}
            <SelectedTaskModal setViewTaskModal={setViewTaskModal} viewTaskModal={viewTaskModal} selectedTask={selectedTask} />

        </div>
    );
};

export default TasklistMain;
