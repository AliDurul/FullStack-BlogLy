import { Request, Response } from 'express-serve-static-core';
import Comment, { IComment } from '../models/comment.model';
import Blog from '../models/blog.model';
import Notification from '../models/notification.model';
import { CustomError } from '../utils/common';
import { Schema } from 'mongoose';

const COMMENT_FIELDS = 'personal_info.username personal_info.fullname personal_info.profile_img';

const buildPopulateChildren = (depth: number = 5): any => {
    let populate: any = {
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

const deleteCommentsRecursive = async (commentId: Schema.Types.ObjectId | string): Promise<void> => {

    const comment: IComment | null = await Comment.findById(commentId);
    if (!comment) throw new CustomError('Comment does not exist.', 404, true);

    if (comment.parent) {
        await Comment.findByIdAndUpdate(comment.parent, { $pull: { children: commentId } });
    }

    await Notification.deleteOne({ comment: commentId });
    await Notification.updateOne({ reply: commentId }, { $unset: { reply: 1 } });

    const blog = await Blog.findByIdAndUpdate(
        comment.blog_id,
        {
            $pull: { 'activity.comments': commentId },
            $inc: {
                'activity.total_parent_comments': comment.parent ? 0 : -1,
            },
        }
    );

    if (!blog) throw new CustomError('Blog activity could not be updated.', 400, true);

    if (comment.children?.length) {
        for (const childId of comment.children) {
            await deleteCommentsRecursive(childId);
        }
    }

    await Comment.findByIdAndDelete(commentId);
};

export const listRelatedComments = async (req: Request, res: Response) => {

    const { blog_id } = req.params;

    const page = Math.max(0, Number(req.query.page || 1) - 1);
    const limit = Math.max(1, Number(req.query.limit) || 2);
    const skip = Number(req.query.skip) || page * limit;

    const result = await Comment.find({ blog_id, isReply: false })
        .populate('commented_by', COMMENT_FIELDS)
        .populate(buildPopulateChildren())
        .skip(skip)
        .limit(limit)
        .sort({ commentedAt: -1 });

    const details = await res.getModelListDetails(Comment, { blog_id, isReply: false });

    res.status(200).json({ success: true, result, details: details.pages });

};

export const listReplies = async (req: Request, res: Response) => {
    const { parentId } = req.params;
    const parentComment = await Comment.findById(parentId)
        .populate(buildPopulateChildren())
        .select('children');

    if (!parentComment) throw new CustomError('Parent comment not found.', 404);

    res.status(200).json({ success: true, result: parentComment.children });
};

export const createComment = async (req: Request, res: Response) => {

    const userId = req.user._id;
    const { _id: blogId, comment, blog_author, replying_to, notification_id } = req.body;

    if (!comment || comment.trim().length < 1) throw new CustomError('Comment cannot be empty.', 400, true);

    const commentObj: any = {
        blog_id: blogId,
        comment,
        commented_by: userId,
        blog_author,
    };

    if (replying_to) {
        const parentComment = await Comment.findById(replying_to);
        if (!parentComment) throw new CustomError('Parent comment does not exist.', 400, true);
        commentObj.parent = parentComment?._id
        commentObj.isReply = true;
    }

    const newComment = await Comment.create(commentObj);
    const populatedComment = await newComment.populate('commented_by', COMMENT_FIELDS);

    await Blog.findByIdAndUpdate(blogId, {
        $push: { 'activity.comments': newComment._id },
        $inc: {
            'activity.total_parent_comments': replying_to ? 0 : 1,
        },
    });

    const notificationData: any = {
        type: replying_to ? 'reply' : 'comment',
        blog: blogId,
        user: userId,
        comment: newComment._id,
        notification_for: blog_author,
    };

    if (replying_to) {
        const parent = await Comment.findByIdAndUpdate(replying_to, { $push: { children: newComment._id } }, { new: true });
        if (parent) notificationData.notification_for = parent.commented_by;

        if (notification_id) {
            await Notification.findByIdAndUpdate(notification_id, { reply: newComment._id });
        }

        notificationData.replied_on_comment = replying_to;
    }

    await Notification.create(notificationData);

    res.status(201).json({ success: true, result: populatedComment });

};

export const deleteComment = async (req: Request, res: Response) => {

    const userId = req.user._id;
    const commentId = req.params.blog_id as Schema.Types.ObjectId | string;

    const comment = await Comment.findById(commentId);
    if (!comment) throw new CustomError('Comment does not exist.', 404, true);

    const isOwner = comment.commented_by.toString() === userId.toString();
    const isBlogAuthor = userId.toString() === comment.blog_author.toString();

    if (!isOwner && !isBlogAuthor) throw new CustomError('Unauthorized.', 403, true);

    await deleteCommentsRecursive(commentId);

    res.status(200).json({ success: true, message: 'Comment deleted successfully.' });
};