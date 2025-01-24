'use client';

import { useEditorContext } from '@/contexts/EditorContext';
import React from 'react'

export default function Tag({ tag, tagIndex }: { tag: string, tagIndex: number }) {

    let { blog: { tags }, setBlog } = useEditorContext()


    const handleTagDelete = () => {
        let newTags = tags.filter(t => t !== tag)
        setBlog(prev => ({ ...prev, tags: newTags }))
    }

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            let value = e.currentTarget.textContent?.trim() || '';
            tags[tagIndex] = value;
            setBlog(prev => ({ ...prev, tags: [...tags] }));
            
            e.currentTarget.blur();
        }
    }

    return (
        <div className='relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8'>
            <p className='outline-none' onKeyDown={handleTagKeyDown} contentEditable="true">{tag}</p>
            <button className='mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2' onClick={handleTagDelete}>
                <i className='fi fi-br-cross text-[10px] pointer-events-none' />
            </button>
        </div>
    )
}
