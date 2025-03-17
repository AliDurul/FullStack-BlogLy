import { Document } from 'mongoose';

export interface INotification extends Document {
    type: "like" | "comment" | "reply";
    blog: string;
    notification_for: string;
    user: string;
    comment?: string;
    reply?: string;
    replied_on_comment?: string;
    seen: boolean;
}