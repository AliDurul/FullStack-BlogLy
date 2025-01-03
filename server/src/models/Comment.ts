import { mongoose } from "../configs/dbConnection";

const commentSchema = new mongoose.Schema({

    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'blogs'
    },
    blog_author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'blogs',
    },
    comment: {
        type: String,
        required: true
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'comments'
    },
    commented_by: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users'
    },
    isReply: {
        type: Boolean,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }

},
    {
        timestamps: {
            createdAt: 'commentedAt'
        }
    })

export default mongoose.model("comments", commentSchema)