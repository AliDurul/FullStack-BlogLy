// Page params
export type TSearchParamProps = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

// Api response
export interface IApiArrRes<T> {
    success: boolean;
    result: T[];
}

export interface IApiObjRes<T> {
    success: boolean;
    result: T;
}

// Error Response
export type TError = { success: boolean, message: string }

// Auth form initail state
export type TInitialAuthState = {
    success: boolean,
    message: string,
    errors?: Record<string, string[] | undefined>;
    inputs?: {
        email: string;
        password: string;
        fullname?: string;
    };
}

// Auth Session stste
export type TSession = {
    user: {
        profile_img: string;
        username: string;
        fullname: string;
        iat: number;
        exp: number
    },
    expires: string;
    access: string;
    refresh: string;
} | null;