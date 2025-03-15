import { Document } from 'mongoose';

export interface IBlog extends Document {
    _id: string;
    blog_id: string;
    title: string;
    banner: string;
    des: string;
    content: any[];
    tags: string[];
    author: string;
    activity: Activity;
    comments: string[];
    draft: boolean;
}

export interface IBlogfindOneAndUpdateFn {
    activity: Activity;
    _id: string;
    blog_id: string;
    title: string;
    banner: string;
    des: string;
    content: number[];
    tags: string[];
    author: Author;
    publishedAt: Date;
}

export interface Activity {
    likes: string[];
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
}

export interface Author {
    personal_info: PersonalInfo;
    _id: string;
}

export interface PersonalInfo {
    fullname: string;
    username: string;
    profile_img: string;
}
