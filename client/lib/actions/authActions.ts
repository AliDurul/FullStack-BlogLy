'use server';

import { signIn } from "@/auth";
import { changePasswordSchema, credentialsSchema } from "../zod";
import { revalidatePath } from "next/cache";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { TInitialAuthState } from "@/types/index";

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

}


export const socialCredential = async (payload: FormData) => {
    await signIn("google", {
        callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
    console.log(payload);

    revalidatePath('/');
}