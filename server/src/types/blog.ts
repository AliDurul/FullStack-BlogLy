import { Document } from 'mongoose';

export interface IBlog extends Document {
    blog_id: string;
    title: string;
    banner: string;
    des: string;
    content: any[];
    tags: string[];
    author: string;
    activity: {
        total_likes: number;
        total_comments: number;
        total_reads: number;
        total_parent_comments: number;
    };
    comments: string[];
    draft: boolean;
}