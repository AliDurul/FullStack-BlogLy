import { Schema, model, Model, Document, Types } from "mongoose";

export interface INotification extends Document {
    type: "like" | "comment" | "reply";
    blog: Types.ObjectId;
    notification_for: Types.ObjectId;
    user: Types.ObjectId;
    comment?: Types.ObjectId;
    reply?: Types.ObjectId;
    replied_on_comment?: Types.ObjectId;
    seen: boolean;
};

const notificationSchema = new Schema<INotification>({
    type: {
        type: String,
        enum: ['like', 'comment', 'reply'],
        required: true,
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    notification_for: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
    replied_on_comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
    seen: {
        type: Boolean,
        default: false,
    },
}, {
    collection: 'notifications',
    timestamps: true,
}
);

const Notification: Model<INotification> = model<INotification>('Notification', notificationSchema);
export default Notification;
