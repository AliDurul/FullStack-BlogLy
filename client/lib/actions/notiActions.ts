'use server';

import { auth } from "@/auth";
import { TError } from "@/types";

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.access;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};

const API_URL = process.env.API_BASE_URL

type TCheckNotiFn = () => Promise<{ success: boolean, isNewNotification: boolean } | TError>

export const CheckNoti: TCheckNotiFn = async () => {


    const headers = await authConfig();
    
    let url = `${API_URL}/notifications/new`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers,
            next: { tags: ['newNotif'] }
        },)

        const data = await res.json();

        if (!res.ok && !data.success) {
            return {
                success: data.success,
                message: data.message,
            }
        }

        return data
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        }
    }


}