import { createAppSlice } from "@/lib/createAppSlice"
import { PayloadAction } from "@reduxjs/toolkit";
import { getAllChats } from "./chatActions";
import { Chat } from "@/types/types";

export interface ChatSliceState {
    chats: Chat[];
    status: "idle" | "loading" | "failed";
    error: string | null
    chat: null | Chat;
    isShowChatMenu: boolean;
}

const initialState: ChatSliceState = {
    chats: [],
    status: "idle",
    error: null,
    chat: null,
    isShowChatMenu: false
}


export const chatSlice = createAppSlice({
    name: 'chat',
    initialState,
    reducers: ({ reducer, asyncThunk }) => ({
        setChat: reducer((state, action: PayloadAction<Chat>) => {
            state.status = 'idle';
            state.chat = action.payload;
        }),
        setChats: reducer((state, action: PayloadAction<Chat[]>) => {
            state.status = 'idle';
            state.chats = action.payload;
        }),
        updateChatsState: reducer((state, action: PayloadAction<Chat>) => {
            state.status = 'idle';
            if (!state.chats.some(chat => chat.id === action.payload.id)) {
                state.chats.push(action.payload)
            }
        }),
        setIsShowChatMenu: reducer((state, action: PayloadAction<boolean>) => {
            state.isShowChatMenu = action.payload;
        }),

        fetchAllChatsAsync: asyncThunk(
            async () => {
                try {
                    const response = await getAllChats();

                    if (response.error) {
                        throw new Error(response.error);
                    }

                    return response;
                } catch (error) {
                    throw new Error("Data fetch failed: " + (error as Error).message);
                }
            },
            {
                pending: (state) => { state.status = "loading"; },
                fulfilled: (state, action) => { state.status = "idle"; state.chats = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
    }),
    selectors: {
        selectChats: (chat) => chat.chats,
        selectChat: (chat) => chat.chat,
        selectChatStatus: (chat) => chat.status,
        selectChatStates: (chat) => chat
    }
})

export const { setChat, setChats, fetchAllChatsAsync, setIsShowChatMenu, updateChatsState } = chatSlice.actions;
export const { selectChats, selectChat, selectChatStatus, selectChatStates } = chatSlice.selectors