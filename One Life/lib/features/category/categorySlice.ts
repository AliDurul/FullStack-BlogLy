
import { createAppSlice } from "@/lib/createAppSlice";
import { getAllCategories } from "./categoryAPI";
import { Category } from "@/types/types";
import type { PayloadAction } from "@reduxjs/toolkit";




export interface categorySliceState {
    categories: Category[];
    status: "idle" | "loading" | "failed";
    error: null | string;
}

const initialState: categorySliceState = {
    categories: [],
    status: "idle",
    error: null
};

export const categorySlice = createAppSlice({
    name: 'category',
    initialState,
    reducers: (create) => ({
        updateCategory: create.reducer((state, action: PayloadAction<Category[]>) => {
            state.status = 'loading';
            state.categories = action.payload;
        })
        ,
        fetchAllCategoryAsync: create.asyncThunk(async () => {
            try {
                const response = await getAllCategories();
                if (response.error) {
                    throw new Error(response.error);
                }
                return response;
            } catch (error) {
                throw new Error("Data fetch failed: " + (error as Error).message);
            }
        }, {
            pending: (state) => { state.status = "loading"; },
            fulfilled: (state, action) => { state.status = "idle"; state.categories = action.payload; },
            rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
        },
        ),
    }),
    selectors: {
        selectCategories: (ticket) => ticket.categories,
        selectCategoryState: (ticket) => ticket,
    }
});

export const { fetchAllCategoryAsync, updateCategory } = categorySlice.actions;

export const { selectCategories, selectCategoryState } = categorySlice.selectors
