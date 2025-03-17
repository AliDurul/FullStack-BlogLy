import { Document } from 'mongoose';

export interface IComment extends Document {
    blog_id: string
    blog_author: string
    comment: string;
    children?: string[];
    commented_by: string
    isReply?: boolean;
    parent?: string
    commentedAt: Date
}