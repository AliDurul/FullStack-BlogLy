import { createContext, useContext, useState } from "react";

interface IBlogState {
    title: string;
    banner: string;
    content: string;
    tags: string[];
    des: string;
    author: { personal_info: Record<string, any> };
}

interface IBlogContextType {
    blog: IBlogState;
    setBlog: React.Dispatch<React.SetStateAction<IBlogState>>;
    textEditor: { isReady: boolean };
    setTextEditor: React.Dispatch<React.SetStateAction<{ isReady: boolean }>>;
}

const initialState: IBlogState = {
    title: '',
    banner: '',
    content: '',
    tags: [],
    des: '',
    author: { personal_info: {} },
}

const EditorContext = createContext<IBlogContextType>({
    blog: initialState,
    setBlog: () => { },
    textEditor: { isReady: false },
    setTextEditor: () => { }
})

const EditorProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {

    const [blog, setBlog] = useState(initialState)
    const [textEditor, setTextEditor] = useState({ isReady: false })



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