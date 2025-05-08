import { Model, model, Schema, Document } from "mongoose";

export interface IComment extends Document {
    blog_id: Schema.Types.ObjectId;
    blog_author: Schema.Types.ObjectId;
    comment: string;
    children?: Schema.Types.ObjectId[];
    commented_by: Schema.Types.ObjectId;
    isReply?: boolean;
    parent?: Schema.Types.ObjectId;
    commentedAt: Date
}

const commentSchema = new Schema<IComment>({
    blog_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    blog_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Blog',
    },
    comment: {
        type: String,
        required: true
    },
    commented_by: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    isReply: {
        type: Boolean,
        default: false
    },
    children: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, {
    collection: 'comments',
    timestamps: {
        createdAt: 'commentedAt'
    }
});

const Comment: Model<IComment> = model<IComment>('Comment', commentSchema);
export default Comment;