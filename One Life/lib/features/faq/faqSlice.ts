import { createAppSlice } from "@/lib/createAppSlice";
import { ApiResponse, Faq, Pagination } from "@/types/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllFaqs } from "./faqAPI";

interface defaultParams {
    question: string;
    answer: string;
    id?: number;
}

export interface FaqSliceState {
    faqs: Faq[];
    faq: Faq | defaultParams;
    status: "idle" | "loading" | "failed";
    error: null | string;
    faqModal: boolean;

}

const initialState: FaqSliceState = {
    faqs: [],
    status: "idle",
    faqModal: false,
    error: null,
    faq: {
        question: '',
        answer: '',
    }

};

export const faqSlice = createAppSlice({
    name: 'faq',
    initialState,
    reducers: (create) => ({
        updateFaqs: create.reducer((state, action: PayloadAction<Faq[]>) => {
            state.status = 'idle';
            state.faqs = action.payload;
        }),
        setFaqModal: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.faqModal = action.payload;
        }),
        updateFaqState: create.reducer((state, action: PayloadAction<Faq | defaultParams>) => {
            state.status = 'idle';
            state.faq = action.payload;
        }),
        fetchAllFaqAsync: create.asyncThunk(
            async () => {
                try {
                    const response = await getAllFaqs();

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
                fulfilled: (state, action) => { state.status = "idle"; state.faqs = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
    }),
    selectors: {
        selectFaqs: (faq) => faq.faqs,
        selectFaq: (faq) => faq.faq,
        selectFaqState: (faq) => faq,
        selectFaqModal: (faq) => faq.faqModal,

    }
});

export const { fetchAllFaqAsync, updateFaqs, updateFaqState, setFaqModal } = faqSlice.actions;

export const { selectFaqs, selectFaqState, selectFaq, selectFaqModal } = faqSlice.selectors