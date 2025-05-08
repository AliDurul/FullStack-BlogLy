'use server';

import { auth } from "@/auth";
import { IApiArrRes, TError } from "@/types";
import { INoti } from "@/types/notiTypes";

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

type TfetchNotiFn = ({ type, pageParam, deletedDocCount }: { type: string, pageParam: string, deletedDocCount?: number }) => Promise<IApiArrRes<INoti> | TError>

export const fetchNotis: TfetchNotiFn = async ({ type, pageParam, deletedDocCount = 0 }) => {

    let url = `${API_URL}/notifications`;

    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (pageParam) params.append("page", pageParam as string)
    if (deletedDocCount) params.append("deletedDocCount", deletedDocCount.toString());
    if (params.toString()) url += `?${params.toString()}`;

    const headers = await authConfig();

    console.log('line 68 noti--', url);

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers,
            next: { tags: ['Notifications'] }
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