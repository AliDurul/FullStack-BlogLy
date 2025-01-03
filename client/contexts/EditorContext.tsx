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
}

const initialState: IBlogState = {
    title: '',
    banner: '',
    content: '',
    tags: [],
    des: '',
    author: { personal_info: {} },
}

const EditorContext = createContext<IBlogContextType>({ blog: initialState, setBlog: () => { } })

const EditorProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {

    const [blog, setBlog] = useState(initialState)



    return (
        <EditorContext.Provider value={{ blog, setBlog }}>
            {children}
        </EditorContext.Provider>
    )
}

export const useEditorContext = () => {
    return useContext(EditorContext)
}



export default EditorProvider