'use server';

import { signIn } from "@/auth";

import { TInitialAuthState } from "../types";
import { credentialsSchema } from "../zod";

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
        await signIn('credentials', result.data);

        return {
            success: true,
            message: "Sign-in successful. Welcome, " + fullname + "!",
        };

    } catch (error) {
        console.error('Error during sign-in:', error);

        return {
            success: false,
            message: 'An error occurred. Please try again.',
        };
    }







}
