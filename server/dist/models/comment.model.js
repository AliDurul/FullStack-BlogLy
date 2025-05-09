"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    blog_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    blog_author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog',
    },
    comment: {
        type: String,
        required: true
    },
    commented_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    isReply: {
        type: Boolean,
        default: false
    },
    children: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Comment'
    },
    parent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, {
    collection: 'comments',
    timestamps: {
        createdAt: 'commentedAt'
    }
});
const Comment = (0, mongoose_1.model)('Comment', commentSchema);
exports.default = Comment;
//# sourceMappingURL=comment.model.js.map