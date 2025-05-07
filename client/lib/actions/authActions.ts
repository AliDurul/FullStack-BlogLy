'use server';

import { signIn } from "@/auth";
import { changePasswordSchema, credentialsSchema, emailverificationSchema, forgotPasswordSchema } from "../zod";
import { revalidatePath } from "next/cache";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { TInitialAuthState } from "@/types/index";

const API_BASE_URL = process.env.API_BASE_URL;


export const authCredential = async (initialState: TInitialAuthState, payload: FormData) => {

    const { email, password, fullname } = Object.fromEntries(payload.entries());
    const rowData = { email, password, fullname };

    const result = credentialsSchema.safeParse(rowData);


    if (!result.success) {

        return {
            success: false,
            message: 'Plesae fix errors in the form.',
            errors: result.error.flatten().fieldErrors,
            inputs: rowData
        } as TInitialAuthState;

    }

    try {

        if (result.data.fullname) {
            // register
            const res = await fetch(API_BASE_URL + '/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.data),
                cache: 'no-store'
            });

            const data = await res.json();

            if (!res.ok && !data.success) return { success: data.success, message: data.message, }

            return data;
        }

        // login
        await signIn('credentials', {
            email: result.data.email,
            password: result.data.password,
            fullname: result.data.fullname,
        });

        return {
            success: true,
            message: "Sign-in successful. Welcome, " + fullname + "!",
        };


    } catch (error) {

        let errorMsg = '';
        let success = false;

        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            // user is already logged in and redirected
            success = true;
            redirect(DEFAULT_LOGIN_REDIRECT);
        } else if (error instanceof AuthError) {
            errorMsg = error.message;
        } else {
            errorMsg = (error as any).message;
        }

        return {
            success,
            message: errorMsg || 'Something went wrong.',
            inputs: rowData
        } as TInitialAuthState;
    }

};

export const socialCredential = async (payload: FormData) => {
    await signIn("google", {
        callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
    console.log(payload);

    revalidatePath('/');
};

export const verifyEmail = async (verificationCode: string) => {

    const result = emailverificationSchema.safeParse({ verificationCode });

    if (!result.success) {
        return {
            success: false,
            message: result.error.flatten().fieldErrors.verificationCode,
        }
    }

    try {
        const res = await fetch(API_BASE_URL + '/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ verificationToken: verificationCode }),
            cache: 'no-store'
        });

        const data = await res.json();

        if (!res.ok && !data.success) return { success: data.success, message: data.message, }

        return data;
    }
    catch (error) {
        return {
            success: false,
            message: (error as Error).message || 'Something went wrong.',
        }
    }
};

export const resetPassword = async (_: unknown, payload: FormData) => {
    console.log(payload);
    const { email } = Object.fromEntries(payload.entries());

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) return { success: false, message: result.error.flatten().fieldErrors.email, }

    try {
        const res = await fetch(API_BASE_URL + '/auth/forget-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result.data),
            cache: 'no-store'
        });

        const data = await res.json();

        if (!res.ok && !data.success) return { success: data.success, message: data.message, }

        return data;
    }
    catch (error) {
        return {
            success: false,
            message: (error as Error).message || 'Something went wrong.',
        }
    }
}
