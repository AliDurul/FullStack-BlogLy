// ====== URL QUERY PARAMS
export type TUrlQueryParams = {
    params: string
    key: string
    value: string | null
}

export type TRemoveUrlQueryParams = {
    params: string
    keysToRemove: string[]
}

export type TSearchParamProps = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

//
export type TInputField = {
    name: string;
    type: 'text' | 'email' | 'password';
    placeholder: string;
    id?: string;
    value?: string;
    icon: string;
    errors?: any;
};

// Error Response
export type TError = {
    success: boolean;
    message?: string;
    errors?: [string]

}

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
export interface TLatestBlogResponse {
    details: IDetails;
    success: boolean;
    result: LatestBlogResult[];
}

export interface IDetails {
    previous: boolean | number;
    current: number;
    next: number | boolean;
    total: number;
    totalRecords: number;
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
    personal_info: BlogPersonalInfo;
}

export interface BlogPersonalInfo {
    fullname: string;
    username: string;
    profile_img: string;
}


/* Trending Blog */
export interface TTrendingBlogResponse {
    success: boolean;
    result: TTrendingBlog[];
}

export interface TTrendingBlog {
    blog_id: string;
    title: string;
    author: TrendingBlogAuthor;
    publishedAt: Date;
}

export interface TrendingBlogAuthor {
    personal_info: BlogPersonalInfo;
}


