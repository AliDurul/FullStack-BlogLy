import { createContext, useContext, useState } from "react";
import EditorJS from '@editorjs/editorjs'

interface IBlogState {
    title: string;
    banner: string;
    content: any[];
    tags: string[];
    des: string;
    author: { personal_info: Record<string, any> };
}

interface IBlogContextType {
    blog: IBlogState;
    setBlog: React.Dispatch<React.SetStateAction<IBlogState>>;
    textEditor: EditorJS | null;
    setTextEditor: (editor: EditorJS | null) => void;
}

const initialState: IBlogState = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    des: '',
    author: { personal_info: {} },
}

const EditorContext = createContext<IBlogContextType>({
    blog: initialState,
    setBlog: () => { },
    textEditor: null,
    setTextEditor: () => { }
})

const EditorProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {

    const [blog, setBlog] = useState(initialState)
    const [textEditor, setTextEditor] = useState<EditorJS | null>(null)

    return (
        <EditorContext.Provider value={{ blog, setBlog, textEditor, setTextEditor }}>
            {children}
        </EditorContext.Provider>
    )
}

export const useEditorContext = () => {
    return useContext(EditorContext)
}



export default EditorProvider