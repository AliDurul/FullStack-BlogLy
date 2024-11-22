'use server'

import { auth } from "@/auth";

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL + '/'

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.accessToken;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};

const authConfigFormData = async () => {
    const session = await auth();
    const accessToken = session?.accessToken;

    return {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "multipart/form-data",
    };
}

export const getAllChats = async () => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}chats/`, {
            cache: "no-cache",
            headers,
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};

export const getChat = async (chatId: string) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}chat/${chatId}/`, {
            cache: "no-cache",
            headers,
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};

export const getMessagesForChat = async (chatId: number) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}chats/message/${chatId}/`, {
            cache: "no-cache",
            headers,
        });
        const data = await response.json();

        if (response.ok) {
            return data.messages;
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};

export const postMessage = async (chatId: number | null, messageData: { receiver: number, content?: string }) => {
    const headers = await authConfig();

    let url = `${BASE_URL}message/?chat_id=${chatId}`;

    if (!chatId) url = `${BASE_URL}message/`;

    try {
        const response = await fetch(url, {
            cache: "no-cache",
            headers,
            method: "POST",
            body: JSON.stringify(messageData),
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};

export const postGroup = async (groupData: any) => {
    const headers = await authConfigFormData();
    try {
        const response = await fetch(`${BASE_URL}chats/group`, {
            headers,
            method: "POST",
            body: groupData,

        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};



