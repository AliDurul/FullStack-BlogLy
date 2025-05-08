import { model, Schema, Model, Document } from 'mongoose';

export interface IBlog extends Document {
    _id: Schema.Types.ObjectId;
    blog_id: string;
    title: string;
    banner: string;
    des: string;
    content: any[];
    tags: string[];
    author: Schema.Types.ObjectId;
    activity: Activity;
    comments: string[];
    draft: boolean;
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
    _id: Schema.Types.ObjectId;
}

export interface PersonalInfo {
    fullname: string;
    username: string;
    profile_img: string;
}


const blogSchema = new Schema<IBlog>({

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
        required: true,
    },
    des: {
        type: String,
        maxlength: 200,
        required: true
    },
    content: {
        type: [],
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    activity: {
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
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

}, {
    collection: 'blogs',
    timestamps: { createdAt: 'publishedAt' }

});

const Blog: Model<IBlog> = model<IBlog>('Blog', blogSchema);
export default Blog;