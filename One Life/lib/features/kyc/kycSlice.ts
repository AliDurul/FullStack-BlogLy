import { createAppSlice } from "@/lib/createAppSlice";
import { getAllKycs } from "./kycAPI";
import { ApiResponse, Kyc, Pagination } from "@/types/types";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface KycSliceState {
    kycs: Pagination<Kyc>;
    kyc: Kyc | null | undefined
    status: "idle" | "loading" | "failed";
    error: null | string;
    value: string;
    activeUsers: any[]
}



const initialState: KycSliceState = {
    kycs: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    status: "idle",
    error: null,
    kyc: null,
    value: 'list',
    activeUsers: []
};

export const kycSlice = createAppSlice({
    name: 'kyc',
    initialState,
    reducers: ({ reducer, asyncThunk }) => ({
        updateKycs: reducer((state, action: PayloadAction<Kyc[]>) => {
            state.status = 'idle';
            state.kycs.results = action.payload;
        }),
        setValue: reducer((state, { payload }: PayloadAction<string>) => {
            state.status = 'idle';
            state.value = payload;
        }),
        updateKycState: reducer((state, action: PayloadAction<Kyc | null | undefined>) => {
            state.status = 'idle';
            state.kyc = action.payload;
        }),
        setActiveUsersState: reducer((state, action: PayloadAction<any[]>) => {
            state.activeUsers = action.payload
        }),
        fetchAllKycAsync: asyncThunk(
            async (params: { type?: string, page?: string, pageSize?: string, search?: string }) => {
                const { type, page, pageSize, search } = params
                try {
                    const response: ApiResponse = await getAllKycs(type, page, pageSize, search);
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
                fulfilled: (state, action) => { state.status = "idle"; state.kycs = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
    }),
    selectors: {
        selectKycs: (kyc) => kyc.kycs,
        selectKyc: (kyc) => kyc.kyc,
        selectValue: (kyc) => kyc.value,
        selectKycState: (kyc) => kyc,
        selectKycStatus: (kyc) => kyc.status,
        selectActiveUsers: (kyc) => kyc.activeUsers
    }
});

export const { fetchAllKycAsync, updateKycs, updateKycState, setValue, setActiveUsersState } = kycSlice.actions;

export const { selectValue, selectKycs, selectKycState, selectKyc, selectKycStatus, selectActiveUsers } = kycSlice.selectors