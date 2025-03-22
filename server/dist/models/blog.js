"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("../configs/dbConnection");
const blogSchema = new dbConnection_1.mongoose.Schema({
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
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    activity: {
        likes: [
            {
                type: dbConnection_1.mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: dbConnection_1.mongoose.Schema.Types.ObjectId,
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
    timestamps: {
        createdAt: 'publishedAt'
    }
});
exports.default = dbConnection_1.mongoose.model("Blog", blogSchema);
//# sourceMappingURL=blog.js.map