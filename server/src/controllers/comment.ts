import { CustomError } from "../helpers/utils";
import { Request, Response } from 'express-serve-static-core';
import Comment from "../models/comment";
import blog from "../models/blog";
import Notification from "../models/notification";

export const create = async (req: Request, res: Response) => {
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

    const { _id, comment, blog_author } = req.body;

    if (comment.length < 1) throw new CustomError('Comment cannot be empty.', 400);

    const newComment = new Comment({
        blog_id: _id,
        comment,
        commented_by: req.user._id,
        blog_author,
    })

    const commentedData = await newComment.save();

    if (!commentedData) throw new CustomError('Comment could not be created.', 400);

    await blog.findByIdAndUpdate(_id, { $push: { "activity.comments": commentedData._id }, $inc: { "activity.total_comments": 1, "activity.total_parent_comments": 1 } });

    const notification = new Notification({
        type: 'comment',
        blog: _id,
        notification_for: blog_author,
        user: user_id,
        comment: commentedData._id

    })

    await notification.save();

    const { commentedAt, } = commentedData;

    res.status(201).send({
        success: true,
        result: commentedData
    })

}