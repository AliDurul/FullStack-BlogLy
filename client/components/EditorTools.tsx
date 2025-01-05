// @ts-nocheck
import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Code from '@editorjs/code';
import { config } from 'process';
import { uploadImage } from '@/lib/actions/uploadImageAction';

// import CheckList from '@editorjs/checklist';
// import LinkTool from '@editorjs/link';
// import Table from '@editorjs/table';
// import Warning from '@editorjs/warning';


const uploadImageByUrl = (e: any) => {

    let link = new Promise((resolve, reject) => {
        try {
            resolve(e)
        } catch (error) {
            reject(error)
        }
    })

    return link.then((url) => {
        return { success: 1, file: { url } }
    })
}

const uploadImageByFIle = (e: any) => {

    return uploadImage(e).then((url) => {
        if (url) {
            return { success: 1, file: { url } }
        }
        return { success: 0, message: 'Failed to upload image' }
    })

}

export const EditorTools = {
    embed: Embed,
    list: {
        class: List as any,
        inlineToolbar: true
    },
    image: {
        class: ImageTool as any,
        config: {
            uploader: {
                uploaderUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFIle,
            }
        }
    },
    header: {
        class: Header as any,
        config: {
            placeholder: 'Type your title here...',
            levels: [2, 3, 4, 5],
            defaultLevel: 2
        },
        inlineToolbar: true
    },
    quote: {
        class: Quote as any,
        inlineToolbar: true
    },
    marker: {
        class: Marker as any,
        inlineToolbar: true
    },
    inlineCode: {
        class: InlineCode as any,
        inlineToolbar: true
    },
    code: {
        class: Code as any,
        inlineToolbar: true
    }
}

