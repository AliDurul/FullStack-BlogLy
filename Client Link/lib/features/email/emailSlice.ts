import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction, } from "@reduxjs/toolkit";
import { Email, Folder } from "@/types/types";
import { getAllEmailFolders, getAllEmailsForFolder, getEmailById, updateEmailProperties } from "@/lib/features/email/mailAPI";

export interface EmailSliceState {
    emails: Email[];
    folders: Folder[];
    status: "idle" | "loading" | "failed";
    error: null | string;
    mail: null | Email | any;
    isShowMailMenu: boolean;
    selectedTab: string;
    pagedMails: any[];
    assignModal: boolean;
    folderId: string;
    defaultParams: any;
    isEdit: boolean;
    ids: any[];
    params: any
}

const defaultParams = {

    from: 'jacobs@paylinkzm.com',
    to: '',
    cc: '',
    title: '',
    file: null,
    description: '',
    comment: `
            <p><br></p>
            <p><br></p>
            <p><span style=\"color: black;\"><span class=\"ql-cursor\">﻿</span>Thanks &amp; Regards</span></p>
            <p><span style=\"color: black;\">JACOB SHONGA</span></p>
            <p><strong>PayLink Technologies Zambia Limited,&nbsp;</strong></p>
            <p>2nd Floor Finance House, Heroes Place, Cairo Road, Lusaka, Zambia</p>
            <p>Mobile: +260 973834511 | Website: www.paylinkzm.com</p>
        `,
    displayDescription: '',

}

const initialState: EmailSliceState = {
    emails: [],
    folders: [],
    status: "idle",
    error: null,
    mail: null,
    isShowMailMenu: false,
    selectedTab: 'Inbox',
    pagedMails: [],
    assignModal: false,
    isEdit: false,
    ids: [],
    params: JSON.parse(JSON.stringify(defaultParams)),
    defaultParams,
    folderId: 'AQMkADczMWZjOGQ2LWYzZjYtNGRiYy1hNGJhLWQ4MWEzMjhkM2M2OQAuAAADDcfNN0obY06oytW6pASbIAEASKmNop-NnEGYHstHS1IuyQAAAgEMAAAA'
};

export const emailSlice = createAppSlice({
    name: 'email',
    initialState,
    reducers: ({ reducer, asyncThunk }) => ({
        updateEmailState: reducer((state, action: PayloadAction<Email | null>) => {
            state.status = 'idle';
            state.mail = action.payload;
        }),
        setIsShowMailMenu: reducer((state, action: PayloadAction<boolean>) => {
            state.isShowMailMenu = action.payload;
        }),
        setAssignModal: reducer((state, action: PayloadAction<boolean>) => {
            state.assignModal = action.payload;
        }),
        setIsEdit: reducer((state, action: PayloadAction<boolean>) => {
            state.isEdit = action.payload;
        }),
        setPagedMails: reducer((state, action: PayloadAction<any[]>) => {
            state.pagedMails = action.payload;
        }),
        setIds: reducer((state, action: PayloadAction<any[]>) => {
            state.ids = action.payload;
        }),
        // setParams: reducer((state, action: PayloadAction<any[]>) => {
        //     state.ids = action.payload;
        // }),
        setSelectedTab: reducer((state, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        }),
        setFolderId: reducer((state, action: PayloadAction<string>) => {
            state.folderId = action.payload;
        }),
        updateEmails: reducer((state, action: PayloadAction<Email[]>) => {
            state.status = 'idle';
            state.emails = action.payload;
        }),
        openMail: reducer((state, action: PayloadAction<{ type: string, item: any }>) => {

            const { type, item } = action.payload;
            const { defaultParams } = state;
            let data = JSON.parse(JSON.stringify(item));


            const e1 = data?.sender?.emailAddress
            const e2 = data?.toRecipients[0]?.emailAddress

            if (type === 'add') {
                state.isShowMailMenu = false;
                state.defaultParams = JSON.parse(JSON.stringify(defaultParams));

            } else if (type === 'Drafts') {
                data = JSON.parse(JSON.stringify(item));
                state.defaultParams = {
                    ...data,
                    from: defaultParams.from,
                    to: e1?.address && e1?.address !== defaultParams.from ? e1?.address : e2?.address,
                    displayDescription: data?.body?.content,
                    comment: data?.body?.content
                }
            } else if (type === 'reply') {
                data = JSON.parse(JSON.stringify(item));
                state.defaultParams = {
                    ...data,
                    from: defaultParams.from,
                    to: e1.address !== defaultParams.from ? e1.address : e2.address,
                    title: 'Re: ' + data.subject,
                    displayDescription: 'Re: ' + data.body.content,
                }
            } else if (type === 'forward') {
                let data = JSON.parse(JSON.stringify(item));
                state.defaultParams = {
                    ...data,
                    from: defaultParams.from,
                    to: e1?.address && e1?.address !== defaultParams.from ? e1?.address : e2?.address,
                    title: 'Fwd: ' + data.subject,
                    displayDescription: 'Fwd: ' + data.body.content,
                    comment: data?.body?.content
                }
            }

            state.isEdit = true;
        }),
        setImportant: asyncThunk(
            async ({ mail }, thunkAPI: any) => {
                const state = thunkAPI.getState()
                const folderId = state.email.folderId

                if (mail) {

                    const { id: emailId, flag } = mail
                    const isRead = null;
                    const flagStatus = null
                    const importance = 'high'

                    try {
                        const [updatedEmail, fetchedEmails] = await Promise.all([
                            await updateEmailProperties({ emailId, isRead, flagStatus, importance }),
                            getAllEmailsForFolder(folderId)
                        ])

                        if (fetchedEmails.error) {
                            throw new Error(fetchedEmails.error);
                        }

                        return fetchedEmails;

                    } catch (error) {
                        throw new Error("Data fetch failed: " + (error as Error).message);
                    }

                    // searchMails(false);
                }
            },
            {
                pending: (state) => { state.status = "loading"; },
                fulfilled: (state, action) => { state.status = "idle"; state.emails = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
        setStar: asyncThunk(
            async ({ mail, assignIt }, thunkAPI: any) => {
                const state = thunkAPI.getState()
                const folderId = state.email.folderId
                if (mail) {
                    const { id: emailId, flag } = mail
                    const isRead = null;
                    let flagStatus = flag?.flagStatus === 'flagged' ? 'complete' : flag?.flagStatus === 'notFlagged' ? 'flagged' : 'flagged'

                    if (assignIt) flagStatus = 'complete'
                    const importance = null

                    try {
                        const [updatedEmail, fetchedEmails] = await Promise.all([
                            updateEmailProperties({ emailId, isRead, flagStatus, importance }),
                            getAllEmailsForFolder(folderId)
                        ])
                        if (fetchedEmails.error) {
                            throw new Error(fetchedEmails.error);
                        }
                        return fetchedEmails;
                    } catch (error) {
                        throw new Error("Data fetch failed: " + (error as Error).message);
                    }

                    // searchMails(false);
                }
            },
            {
                pending: (state) => { state.status = "loading"; },
                fulfilled: (state, action) => { state.status = "idle"; state.emails = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
        fetchAllEmailsAsync: asyncThunk(
            async (folderId) => {
                try {
                    const response = await getAllEmailsForFolder(folderId);
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
                fulfilled: (state, action) => { state.status = "idle"; state.emails = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
        fetchAllEmailsFolderAsync: asyncThunk(
            async () => {
                try {
                    const response = await getAllEmailFolders();
                    if (response.error) {
                        throw new Error(response.error);
                    }
                    return response;
                } catch (error) {
                    throw new Error("Data fetch failed: " + (error as Error).message);
                }

            },
            {
                pending: (state) => { },
                fulfilled: (state, action) => { state.folders = action.payload; },
                rejected: (state, action) => { state.error = action.error.message || null; },
            },
        ),
        fetchEmailByIdAsync: asyncThunk(
            async (emailId) => {
                try {
                    const response = await getEmailById(emailId);
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
                fulfilled: (state, action) => { state.status = "idle"; state.mail = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
    }),
    selectors: {
        selectEmails: (email) => email.emails,
        selectEmailStatus: (email) => email.status,
        selectMail: (email) => email.mail,
        selectFolders: (email) => email.folders,
        selectIsShowMailMenu: (email) => email.isShowMailMenu,
        selectSelectedTab: (email) => email.selectedTab,
        selectPagedMails: (email) => email.pagedMails,
        selectAsssignModal: (email) => email.assignModal,
        selectFolderId: (email) => email.folderId,
        selectIds: (email) => email.ids,
        selectDefaultParams: (email) => email.defaultParams,
        selectIsEdit: (email) => email.isEdit,
    }
});

export const {
    fetchAllEmailsAsync,
    updateEmailState,
    updateEmails,
    fetchAllEmailsFolderAsync,
    setIsShowMailMenu,
    setSelectedTab,
    fetchEmailByIdAsync,
    setPagedMails,
    setAssignModal,
    setStar,
    setFolderId,
    setIds,
    setImportant,
    openMail,
    setIsEdit
} = emailSlice.actions;

export const {
    selectEmails,
    selectEmailStatus,
    selectMail,
    selectFolders,
    selectIsShowMailMenu,
    selectSelectedTab,
    selectPagedMails,
    selectAsssignModal,
    selectFolderId,
    selectDefaultParams,
    selectIds,
    selectIsEdit
} = emailSlice.selectors