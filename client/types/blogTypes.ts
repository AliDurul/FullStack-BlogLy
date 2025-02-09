/* Common Interfaces */
export interface IPersonalInfo {
    fullname: string;
    username: string;
    profile_img: string;
}

export interface IActivity {
    likes: string[];
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
}

/* Latest Blog */
export interface IDetails {
    previous: boolean | number;
    current: number;
    next: number | boolean;
    total: number;
    totalRecords: number;
}

export interface ILatestBlogResult {
    activity: IActivity;
    blog_id: string;
    title: string;
    banner: string;
    des: string;
    tags: string[];
    author: ILatestBlogAuthor;
    publishedAt: Date;
}

export interface ILatestBlogAuthor {
    personal_info: IPersonalInfo;
}

/* Trending Blog */
export interface ITrendingBlog {
    blog_id: string;
    title: string;
    author: ITrendingBlogAuthor;
    publishedAt: Date;
}

export interface ITrendingBlogAuthor {
    personal_info: IPersonalInfo;
}

/* Single Blog */
export interface ISingleBlog {
    activity: IActivity;
    _id: string;
    blog_id: string;
    title: string;
    banner: string;
    des: string;
    content: number[];
    tags: string[];
    author: IAuthor;
    publishedAt: Date;
}

export interface IAuthor {
    personal_info: IPersonalInfo;
    _id: string;
}


export interface IComment {
    _id: string;
    blog_id: string;
    blog_author: string;
    comment: string;
    commented_by: CommentedBy;
    isReply: boolean;
    children: any[];
    commentedAt: Date;
    updatedAt: Date;
    parent: string;
    __v: number;
}

export interface CommentedBy {
    personal_info: IPersonalInfo;
    _id: string;
}



