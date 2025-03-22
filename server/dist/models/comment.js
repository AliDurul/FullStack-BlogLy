"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("../configs/dbConnection");
const commentSchema = new dbConnection_1.mongoose.Schema({
    blog_id: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    blog_author: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog',
    },
    comment: {
        type: String,
        required: true
    },
    commented_by: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    isReply: {
        type: Boolean,
        default: false
    },
    children: {
        type: [dbConnection_1.mongoose.Schema.Types.ObjectId],
        ref: 'Comment'
    },
    parent: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, {
    collection: 'comments',
    timestamps: {
        createdAt: 'commentedAt'
    }
});
exports.default = dbConnection_1.mongoose.model("Comment", commentSchema);
//# sourceMappingURL=comment.js.map