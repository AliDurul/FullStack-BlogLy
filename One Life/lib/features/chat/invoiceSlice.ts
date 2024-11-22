import { createAppSlice } from "@/lib/createAppSlice"
import { PayloadAction } from "@reduxjs/toolkit";
import exp from "constants";

export interface ChatSliceState {
    chatRooms: any[],
    status: "idle" | "loading" | "failed",
    error: null | string,
    chatRoom: null | any
}

const initialState = {
    chatRooms: [],
    status: "idle",
    error: null,
    chatRoom: null
}


export const chatSlice = createAppSlice({
    name: 'chat',
    initialState,
    reducers: (create) => ({
        setChatRoom: create.reducer((state, action: PayloadAction<any>) => {
            state.status = 'idle';
            state.chatRoom = action.payload;
        }),
        setChatRooms: create.reducer((state, action: PayloadAction<[]>) => {
            state.status = 'idle';
            state.chatRooms = action.payload;
        }),
        // fetchAllChatRoomsAsync: create.asyncThunk(
        //     async () => {
        //         try {
        //             const response = await 
        //             if (response.error) {
        //                 throw new Error(response.error);
        //             }
        //             return response;
        //         } catch (error) {
        //             throw new Error("Data fetch failed: " + (error as Error).message);
        //         }
        //     },
        //     {
        //         pending: (state) => { state.status = "loading"; },
        //         fulfilled: (state, action) => { state.status = "idle"; state.chatRooms = action.payload; },
        //         rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
        //     },
        // ),
    }),
    selectors: {
        selectChatRooms: (chat) => chat.chatRooms,
        selectChatRoom: (chat) => chat.chatRoom,
        selectChatStatus: (chat) => chat.status
    }
})

export const { setChatRoom, setChatRooms } = chatSlice.actions;
export const { selectChatRooms, selectChatRoom, selectChatStatus } = chatSlice.selectors