import { mongoose } from "../configs/dbConnection";
import { IBlog } from "../types/blog";


const blogSchema = new mongoose.Schema({

    blog_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        // required: true,
    },
    des: {
        type: String,
        maxlength: 200,
        // required: true
    },
    content: {
        type: [],
        // required: true
    },
    tags: {
        type: [String],
        // required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    activity: {
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        total_likes: {
            type: Number,
            default: 0
        },
        
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_parent_comments: {
            type: Number,
            default: 0
        },
    },
    draft: {
        type: Boolean,
        default: false
    }

},
    {
        collection: 'blogs',
        timestamps: {
            createdAt: 'publishedAt'
        }

    })

export default mongoose.model<IBlog>("Blog", blogSchema);