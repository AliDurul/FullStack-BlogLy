import { mongoose } from "../configs/dbConnection";
import { IComment } from "../types/comment";

const commentSchema = new mongoose.Schema({

    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    blog_author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog',
    },
    comment: {
        type: String,
        required: true
    },
    commented_by: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    isReply: {
        type: Boolean,
        default: false
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }

},
    {
        collection: 'comments',
        timestamps: {
            createdAt: 'commentedAt'
        }
    })

export default mongoose.model<IComment>("Comment", commentSchema)