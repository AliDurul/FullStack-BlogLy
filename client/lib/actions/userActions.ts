'use server'

import { auth } from "@/auth";
import { IApiArrRes, IApiObjRes, TError } from "@/types";
import { ISearchUser, IUser } from "@/types/userTypes";
import { changePasswordSchema } from "../zod";

const API_URL = process.env.API_BASE_URL

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.access;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};


type TfetchUsersFn = (username?: string) => Promise<IApiArrRes<ISearchUser> | TError>

export const fetchUsers: TfetchUsersFn = async (username) => {

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    let url = `${API_URL}/users`;

    const params = new URLSearchParams();
    if (username) params.append("username", username);
    if (params.toString()) url += `?${params.toString()}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
        })

        const data = await res.json();

        if (!res.ok && data.error) {
            return {
                success: false,
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

type TfetchUserFn = (username?: string) => Promise<IApiObjRes<IUser> | TError>

export const fetchUser: TfetchUserFn = async (username) => {

    await new Promise((resolve) => setTimeout(resolve, 1000));


    let url = `${API_URL}/users/${username}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
        })

        const data = await res.json();

        if (!res.ok && data.error) {
            return {
                error: true,
                errors: [data.message],
            }
        }

        return data

    } catch (error) {
        return {
            error: true,
            message: (error as Error).message,
        }
    }

}

export const changePassword = async (_: unknown, payload: FormData) => {

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { currentPassword, newPassword } = Object.fromEntries(payload.entries());

    const rowData = { currentPassword, newPassword };

    const result = changePasswordSchema.safeParse(rowData);

    if (!result.success) {
        return {
            success: false,
            message: 'Plesae fix errors in the form.',
            errors: result.error.flatten().fieldErrors,
            inputs: rowData
        };
    }

    const headers = await authConfig();

    const res = await fetch(`${API_URL}/users/change-password`, {
        method: 'POST',
        body: JSON.stringify(result.data),
        headers
    })

    const data = await res.json();

    if (!res.ok && !data.success) return { success: data.success, message: data.message, inputs: rowData }


    return data




}