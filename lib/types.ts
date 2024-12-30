export type TInputField = {
    name: string;
    type: 'text' | 'email' | 'password';
    placeholder: string;
    id?: string;
    value?: string;
    icon: string;
    errors?: any;
};

export type TAnimationWrapper = {
    children: React.ReactNode;
    initial?: Record<string, any>;
    animate?: Record<string, any>;
    transition?: Record<string, any>;
    className?: string;
}

export type TRegisterRowData = {
    fullname?: string;
    email?: string;
    password?: string;
}

export type TInitialAuthState = {
    success: boolean,
    message: string,
    // errors?: {
    //     email?: string[];
    //     fullname?: string[];
    //     password?: string[];
    // };
    errors?:Record<string, string[] | undefined>;
    inputs?: {
        email: string;
        password: string;
        fullname?: string;
    };
}

