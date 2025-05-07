"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.listReplies = exports.listRelatedComments = void 0;
const comment_model_1 = __importDefault(require("../models/comment.model"));
const blog_model_1 = __importDefault(require("../models/blog.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const common_1 = require("../utils/common");
const COMMENT_FIELDS = 'personal_info.username personal_info.fullname personal_info.profile_img';
const buildPopulateChildren = (depth = 5) => {
    let populate = {
        path: 'children',
        populate: {
            path: 'commented_by',
            select: COMMENT_FIELDS,
        },
        options: {
            sort: { commentedAt: -1 },
        },
    };
    for (let i = 1; i < depth; i++) {
        populate = {
            path: 'children',
            populate,
            options: { sort: { commentedAt: -1 } },
        };
    }
    return populate;
};
const deleteCommentsRecursive = async (commentId) => {
    const comment = await comment_model_1.default.findById(commentId);
    if (!comment)
        throw new common_1.CustomError('Comment does not exist.', 404, true);
    if (comment.parent) {
        await comment_model_1.default.findByIdAndUpdate(comment.parent, { $pull: { children: commentId } });
    }
    await notification_model_1.default.deleteOne({ comment: commentId });
    await notification_model_1.default.updateOne({ reply: commentId }, { $unset: { reply: 1 } });
    const blog = await blog_model_1.default.findByIdAndUpdate(comment.blog_id, {
        $pull: { 'activity.comments': commentId },
        $inc: {
            'activity.total_comments': -1,
            'activity.total_parent_comments': comment.parent ? 0 : -1,
        },
    });
    if (!blog)
        throw new common_1.CustomError('Blog activity could not be updated.', 400, true);
    if (comment.children?.length) {
        for (const childId of comment.children) {
            await deleteCommentsRecursive(childId);
        }
    }
    await comment_model_1.default.findByIdAndDelete(commentId);
};
const listRelatedComments = async (req, res) => {
    const { blog_id } = req.params;
    const page = Math.max(0, Number(req.query.page || 1) - 1);
    const limit = Math.max(1, Number(req.query.limit) || 2);
    const skip = Number(req.query.skip) || page * limit;
    const result = await comment_model_1.default.find({ blog_id, isReply: false })
        .populate('commented_by', COMMENT_FIELDS)
        .populate(buildPopulateChildren())
        .skip(skip)
        .limit(limit)
        .sort({ commentedAt: -1 });
    const details = await res.getModelListDetails(comment_model_1.default, { blog_id, isReply: false });
    res.status(200).json({ success: true, result, details: details.pages });
};
exports.listRelatedComments = listRelatedComments;
const listReplies = async (req, res) => {
    const { parentId } = req.params;
    const parentComment = await comment_model_1.default.findById(parentId)
        .populate(buildPopulateChildren())
        .select('children');
    if (!parentComment)
        throw new common_1.CustomError('Parent comment not found.', 404);
    res.status(200).json({ success: true, result: parentComment.children });
};
exports.listReplies = listReplies;
const createComment = async (req, res) => {
    const userId = req.user._id;
    const { _id: blogId, comment, blog_author, replying_to, notification_id } = req.body;
    if (!comment || comment.trim().length < 1)
        throw new common_1.CustomError('Comment cannot be empty.', 400, true);
    const commentObj = {
        blog_id: blogId,
        comment,
        commented_by: userId,
        blog_author,
    };
    if (replying_to) {
        const parentComment = await comment_model_1.default.findById(replying_to);
        if (!parentComment)
            throw new common_1.CustomError('Parent comment does not exist.', 400, true);
        commentObj.parent = parentComment?._id;
        commentObj.isReply = true;
    }
    const newComment = await comment_model_1.default.create(commentObj);
    const populatedComment = await newComment.populate('commented_by', COMMENT_FIELDS);
    await blog_model_1.default.findByIdAndUpdate(blogId, {
        $push: { 'activity.comments': newComment._id },
        $inc: {
            'activity.total_comments': 1,
            'activity.total_parent_comments': replying_to ? 0 : 1,
        },
    });
    const notificationData = {
        type: replying_to ? 'reply' : 'comment',
        blog: blogId,
        user: userId,
        comment: newComment._id,
        notification_for: blog_author,
    };
    if (replying_to) {
        const parent = await comment_model_1.default.findByIdAndUpdate(replying_to, { $push: { children: newComment._id } }, { new: true });
        if (parent)
            notificationData.notification_for = parent.commented_by;
        if (notification_id) {
            await notification_model_1.default.findByIdAndUpdate(notification_id, { reply: newComment._id });
        }
        notificationData.replied_on_comment = replying_to;
    }
    await notification_model_1.default.create(notificationData);
    res.status(201).json({ success: true, result: populatedComment });
};
exports.createComment = createComment;
const deleteComment = async (req, res) => {
    const userId = req.user._id;
    const commentId = req.params.blog_id;
    const comment = await comment_model_1.default.findById(commentId);
    if (!comment)
        throw new common_1.CustomError('Comment does not exist.', 404, true);
    const isOwner = comment.commented_by.toString() === userId.toString();
    const isBlogAuthor = userId.toString() === comment.blog_author.toString();
    if (!isOwner && !isBlogAuthor)
        throw new common_1.CustomError('Unauthorized.', 403, true);
    await deleteCommentsRecursive(commentId);
    res.status(200).json({ success: true, message: 'Comment deleted successfully.' });
};
exports.deleteComment = deleteComment;
//# sourceMappingURL=comment.controller.js.map