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
    errors?: Record<string, string[] | undefined>;
    inputs?: {
        email: string;
        password: string;
        fullname?: string;
    };
}

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

/* Latest Blog */
export interface TLatestBlog {
    success: boolean;
    result: LatestBlogResult[];
}

export interface LatestBlogResult {
    activity: LatestBlogActivity;
    blog_id: string;
    title: string;
    banner: string;
    des: string;
    tags: string[];
    author: LatestBlogAuthor;
    publishedAt: Date;
}

export interface LatestBlogActivity {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
}

export interface LatestBlogAuthor {
    personal_info: LatestBlogPersonalInfo;
}

export interface LatestBlogPersonalInfo {
    fullname: string;
    username: string;
    profile_img: string;
}
