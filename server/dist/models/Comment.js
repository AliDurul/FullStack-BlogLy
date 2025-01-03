"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("../configs/dbConnection");
const commentSchema = new dbConnection_1.mongoose.Schema({
    blog_id: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'blogs'
    },
    blog_author: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'blogs',
    },
    comment: {
        type: String,
        required: true
    },
    children: {
        type: [dbConnection_1.mongoose.Schema.Types.ObjectId],
        ref: 'comments'
    },
    commented_by: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users'
    },
    isReply: {
        type: Boolean,
    },
    parent: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }
}, {
    timestamps: {
        createdAt: 'commentedAt'
    }
});
exports.default = dbConnection_1.mongoose.model("comments", commentSchema);
