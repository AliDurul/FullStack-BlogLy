'use client'
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { useState, Fragment, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { postGroup } from '@/lib/features/chat/chatActions';
import { coloredToast } from '@/utils/sweetAlerts';
import { setChats, updateChatsState } from '@/lib/features/chat/chatSlice';
import { useRouter } from 'next/navigation';
import { selectKycs } from '@/lib/features/kyc/kycSlice';
import { ModalCloseIcon } from '@/app/icons/modal';


interface GroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface GroupData {
    [key: string]: string | string[];
    chat_name: string;
    members: string[];
}

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;

export default function GroupModal({ onClose, isOpen }: GroupModalProps) {

    const animatedComponents = makeAnimated();
    const dispatch = useAppDispatch()
    const navigate = useRouter()


    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [chatPicture, setChatPicture] = useState<any | null>(null);
    const { userInfo } = useCurrentUser();

    const users = useAppSelector(selectKycs);

    const userOp = users.results?.filter(user => user.id !== userInfo?.user_id)
        .map(user => ({
            label: user.last_name + " " + user.last_name,
            value: user.id,
            picture: user?.profile_pic
        }));


    const [groupData, setGroupData] = useState<GroupData>({
        "chat_name": "",
        "members": [],
    })

    const handleUpload = () => {
        const fileInput = document.querySelector('.custom-file-container__custom-file__custom-file-input') as HTMLInputElement;
        const file = fileInput.files![0];
        setChatPicture(file);
        // to review
        setPreview(URL.createObjectURL(file));
    }

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = e.target;
        setGroupData({ ...groupData, [id]: value });
    };

    async function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();

        // @ts-ignore
        Object.keys(groupData).forEach((key) => {
            if (key === 'members' && Array.isArray(groupData[key])) {
                formData.append(key, JSON.stringify(groupData[key]));
            } else {
                formData.append(key, groupData[key] as string);
            }
        });

        if (chatPicture) formData.append('chat_picture', chatPicture);

        formData.append("is_group_chat", "true");

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        const res = await postGroup(formData);
        if (!res.error) {
            dispatch(updateChatsState(res.group))
            coloredToast("success", 'succesfully created');
            onClose()
            navigate.push(`/chats/${res.group.id}`)
        } else {
            coloredToast("danger", res.error);
        }

    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={() => onClose()}>
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
                        <Dialog.Panel
                            className='panel border-0 p-0 rounded-lg  w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated'
                        >
                            <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                <h5 className="font-bold text-lg">Create New Group</h5>
                                <button onClick={() => onClose()} type="button" className="text-white-dark hover:text-dark">
                                    <ModalCloseIcon />
                                </button>
                            </div>
                            <div className="p-5">
                                <form onSubmit={handleCreateGroup}>
                                    {/* picture upload */}
                                    <div >
                                        <input
                                            id='chatPicture'
                                            type="file"
                                            className="custom-file-container__custom-file__custom-file-input h-0 w-full"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                                        <div className="upload__image-wrapper">
                                            {!chatPicture && (
                                                <div className="custom-file-container__custom-file__custom-file-control cursor-pointer static mb-5 h-9" onClick={handleDivClick}>
                                                    Choose Profile Pic...
                                                </div>
                                            )}
                                            {preview && (
                                                <div className="custom-file-container__image-preview relative mb-5 ">
                                                    <div className='absolute left-0 text-2xl cursor-pointer' onClick={() => { setChatPicture(null); setPreview(null) }}>x</div>
                                                    <Image
                                                        width={45}
                                                        height={45}
                                                        src={preview}
                                                        alt="img"
                                                        className="m-auto max-w-md h-24 w-24 rounded-full object-cover"
                                                    />

                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="chat_name" className="form-label">Group Name</label>
                                        <input id="chat_name" type="text" placeholder="Enter Group Name" className="form-input flex-1" value={groupData.chat_name} onChange={(e) => changeValue(e)} />
                                    </div>
                                    <Select
                                        placeholder="Select Group Members"
                                        options={userOp}
                                        className=''
                                        isMulti
                                        components={animatedComponents}
                                        formatOptionLabel={(user: any) => (
                                            <div className="flex items-center">
                                                <Image
                                                    src={`${BASE_URL}/image/${user.picture}`}
                                                    alt={user.label}
                                                    width={30}
                                                    height={30}
                                                    className="rounded-full mr-2"
                                                />
                                                <span>{user.label}</span>
                                            </div>
                                        )}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                            setGroupData(() => ({ ...groupData, members: selectedValues }))
                                            // setSelectedUsers(users.filter(user => selectedValues.includes(user.id)));
                                        }}
                                    />



                                    <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>

                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => onClose()}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            {groupData?.id ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog >
        </Transition >
    )
}