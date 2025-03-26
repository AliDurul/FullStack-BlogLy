'use client'

import { useEditorContext } from '@/contexts/EditorContext'
import { useThemeContext } from '@/contexts/ThemeContext'
import { createOupdateBlog } from '@/lib/actions/blogActions'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { startTransition, useActionState, useEffect } from 'react'
import toast from 'react-hot-toast'
import darkLogo from '@/public/assets/images/logo-dark.png'
import lightLogo from '@/public/assets/images/logo-light.png'

export default function EditorNav() {

    const { blog: { title, banner }, blog, setBlog, textEditor } = useEditorContext()
    const { theme } = useThemeContext()

    const router = useRouter()

    const [state, action, isPending] = useActionState(createOupdateBlog, null)


    const handlePublish = () => {

        if (!title || !banner) {
            return toast.error('Please fill title and banner fields')
        }
        // save the content
        if (textEditor?.isReady) {
            textEditor.save().then((data: any) => {
                if (data.blocks?.length) {
                    setBlog({ ...blog, content: data.blocks })
                    router.push('/editor/publish')
                } else {
                    return toast.error('Please write something. Content is empty.')
                }

            })
                .catch((err: any) => {
                    console.log(err)
                })
        }


    }

    const handleDraft = () => {

        if (!title) {
            return toast.error('Write blog title before saving is as a draft.')
        }

        if (textEditor?.isReady) {
            textEditor.save().then((data: any) => {
                // setBlog({ ...blog, content: data.blocks, draft: true })

                let draftData = { ...blog, content: data.blocks, draft: true }

                startTransition(() => {
                    action(draftData);
                });

            })
        }
    };

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
            setTimeout(() => {
                router.push('/blog-management/?draft=true');
            }, 500);
        } else {
            // console.log(state);
            state?.errors?.forEach((error) => {
                toast.error(error);
            });
        }
    }, [state?.success, state?.errors]);


    return (
        <nav className='navbar'>
            <Link href='/' className='flex-none w-10 ' >
                <Image className='w-full' src={theme == 'light' ? darkLogo : lightLogo } width={40} height={44} alt='logo' />
            </Link>
            <p className='max-md:hidden text-black line-clamp-1 w-full'>
                {title ? title : 'New Blog'}
            </p>

            <div className='flex gap-4 ml-auto'>
                <button className='btn-dark py-2 ' onClick={handlePublish}>Publish</button>
                <button
                    disabled={isPending}
                    className={`btn-light px-2 ${isPending && 'disabled:opacity-50 disabled:hover:bg-opacity-100 disabled:cursor-not-allowed'}`}
                    onClick={handleDraft}>
                    {isPending ? 'Saving draft...' : 'Save Draft'}
                </button>
            </div>

        </nav>
    )
}
