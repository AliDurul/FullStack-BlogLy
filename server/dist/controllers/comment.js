"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.listReplies = exports.listRelatedCommets = void 0;
const utils_1 = require("../helpers/utils");
const comment_1 = __importDefault(require("../models/comment"));
const blog_1 = __importDefault(require("../models/blog"));
const notification_1 = __importDefault(require("../models/notification"));
const populateChildren = (path = 'children') => {
    return {
        path,
        populate: {
            path: 'commented_by',
            select: 'personal_info.username personal_info.fullname personal_info.profile_img'
        },
        options: {
            sort: { commentedAt: -1 },
            populate: {
                path: 'children',
                populate: {
                    path: 'commented_by',
                    select: 'personal_info.username personal_info.fullname personal_info.profile_img'
                },
                options: {
                    sort: { commentedAt: -1 },
                    populate: {
                        path: 'children',
                        populate: {
                            path: 'commented_by',
                            select: 'personal_info.username personal_info.fullname personal_info.profile_img'
                        },
                        options: {
                            sort: { commentedAt: -1 },
                            populate: {
                                path: 'children',
                                populate: {
                                    path: 'commented_by',
                                    select: 'personal_info.username personal_info.fullname personal_info.profile_img'
                                },
                                options: {
                                    sort: { commentedAt: -1 },
                                    populate: {
                                        path: 'children',
                                        populate: {
                                            path: 'commented_by',
                                            select: 'personal_info.username personal_info.fullname personal_info.profile_img'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};
const deleteComments = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_1.default.findById(commentId);
    if (!comment)
        throw new utils_1.CustomError('Comment does not exist.', 404);
    if (comment.parent) {
        yield comment_1.default.findOneAndUpdate({ _id: comment.parent }, { $pull: { children: commentId } });
    }
    // Notification.findOneAndDelete({ comment: commentId, type: 'comment' }).then(() => console.log('comment notification deleted'));
    // Notification.findOneAndDelete({ comment: commentId, type: 'reply' }).then(() => console.log('reply notification deleted'));
    notification_1.default.findOneAndDelete({ comment: commentId }).then(() => console.log('comment notification deleted'));
    notification_1.default.findOneAndUpdate({ reply: commentId }, { $unset: { reply: 1 } }).then(() => console.log('reply notification deleted'));
    const blog = yield blog_1.default.findOneAndUpdate({ _id: comment.blog_id }, { $pull: { 'activity.comments': commentId }, $inc: { 'activity.total_comments': -1 }, 'activity.total_parent_comments': comment.parent ? 0 : -1 });
    if (!blog)
        throw new utils_1.CustomError('Blog activity could not be updated.', 400);
    if (comment.children && comment.children.length > 0) {
        for (let child of comment.children) {
            deleteComments(child);
        }
    }
    yield comment_1.default.findByIdAndDelete(commentId);
    console.log('Comment deleted successfully.');
});
const listRelatedCommets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "List Comments"
        #swagger.description = "Endpoint to list all comments."
        #swagger.parameters['obj'] = {
            in: 'query',
            description: 'Blog ID',
            required: true,
            schema: { $ref: "#/definitions/BlogId" }
        }
    */
    const { blog_id } = req.params;
    const { skip, limit } = req.query;
    // pagination
    let page = Number(req.query.page);
    page = page > 0 ? (page - 1) : 0;
    const maxLimit = limit && typeof limit === 'string' && parseInt(limit) > 0 ? parseInt(limit) : 2;
    const skipNumber = skip && typeof skip === 'string' && parseInt(skip) > 0 ? parseInt(skip) : (page * maxLimit);
    const result = yield comment_1.default.find({ blog_id, isReply: false })
        .populate('commented_by', 'personal_info.username personal_info.fullname personal_info.profile_img')
        .populate(populateChildren())
        .skip(page * skipNumber)
        .limit(maxLimit)
        .sort({ commentedAt: -1 });
    res.status(200).send({
        success: true,
        result,
        details: yield res.getModelListDetails(comment_1.default, { blog_id, isReply: false }).then((details) => details.pages)
    });
});
exports.listRelatedCommets = listRelatedCommets;
const listReplies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "List Replies"
        #swagger.description = "Endpoint to list all replies."
        #swagger.parameters['obj'] = {
            in: 'query',
            description: 'Parent Comment ID',
            required: true,
            schema: { $ref: "#/definitions/ParentCommentId" }
        }
    */
    const { parentId } = req.params;
    const result = yield comment_1.default.findOne({ _id: parentId })
        .populate(populateChildren())
        .select('childeren')
        .then((doc) => { return doc.children; });
    res.status(200).send({
        success: true,
        result
    });
});
exports.listReplies = listReplies;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Create Comment"
        #swagger.description = "Endpoint to create a comment."
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Comment data',
            required: true,
            schema: { $ref: "#/definitions/CreateComment" }
        }
    */
    const user_id = req.user._id;
    const { _id, comment, blog_author, replying_to, notification_id } = req.body;
    if (comment.length < 1)
        throw new utils_1.CustomError('Comment cannot be empty.', 400);
    let commentObj = {
        blog_id: _id,
        comment,
        commented_by: user_id,
        blog_author,
    };
    if (replying_to) {
        const parentComment = yield comment_1.default.findById(replying_to);
        if (!parentComment)
            throw new utils_1.CustomError('Parent comment does not exist.', 400);
        commentObj.parent = parentComment === null || parentComment === void 0 ? void 0 : parentComment._id;
        commentObj.isReply = true;
    }
    let commentedData = yield comment_1.default.create(commentObj).then((data) => data.populate('commented_by', 'personal_info.username personal_info.fullname personal_info.profile_img'));
    if (!commentedData)
        throw new utils_1.CustomError('Comment could not be created.', 400);
    yield blog_1.default.findByIdAndUpdate(_id, { $push: { "activity.comments": commentedData._id }, $inc: { "activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1 } });
    let notificationObj = {
        type: replying_to ? 'reply' : 'comment',
        blog: _id,
        notification_for: blog_author,
        user: user_id,
        comment: commentedData._id
    };
    if (replying_to) {
        notificationObj.replied_on_comment = replying_to;
        yield comment_1.default.findOneAndUpdate({ _id: replying_to }, { $push: { children: commentedData._id } }, { new: true }).then((data) => {
            notificationObj.notification_for = data === null || data === void 0 ? void 0 : data.commented_by;
            // data.populate('commented_by', 'personal_info.username personal_info.fullname personal_info.profile_img')
        });
        if (notification_id) {
            notification_1.default.findOneAndUpdate({ _id: notification_id }, { reply: commentedData._id }).then(() => console.log('notification updated'));
        }
    }
    ;
    yield notification_1.default.create(notificationObj);
    res.status(201).send({
        success: true,
        result: commentedData
    });
});
exports.createComment = createComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Delete Comment"
        #swagger.description = "Endpoint to delete a comment."
        #swagger.parameters['obj'] = {
            in: 'query',
            description: 'Comment ID',
            required: true,
            schema: { $ref: "#/definitions/CommentId" }
        }
    */
    const userId = req.user._id;
    const commentId = req.params.blog_id;
    const comment = yield comment_1.default.findById(commentId);
    if (!comment)
        throw new utils_1.CustomError('Comment does not exist.', 404);
    if ((comment.commented_by.toString() !== userId.toString()) && (userId.toString() !== comment.blog_author.toString()))
        throw new utils_1.CustomError('You are not authorized to delete this comment.', 403);
    deleteComments(commentId);
    // if (comment.isReply) {
    //     await Comment.findByIdAndUpdate(comment.parent, { $pull: { children: commentId } });
    // }
    // await Comment.findByIdAndDelete(commentId);
    res.status(200).send({
        success: true,
        message: 'Comment deleted successfully.'
    });
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=comment.js.map