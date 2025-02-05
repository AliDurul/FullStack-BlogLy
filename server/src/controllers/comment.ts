import { CustomError } from "../helpers/utils";
import { Request, Response } from 'express-serve-static-core';
import Comment from "../models/comment";
import blog from "../models/blog";
import Notification from "../models/notification";


export const list = async (req: Request, res: Response) => {
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
    let page = Number(req.query.page)
    page = page > 0 ? (page - 1) : 0

    const maxLimit = limit && typeof limit === 'string' && parseInt(limit) > 0 ? parseInt(limit) : 2;
    const skipNumber = skip && typeof skip === 'string' && parseInt(skip) > 0 ? parseInt(skip) : (page * maxLimit);


    const result = await Comment.find({ blog_id, isReply: false })
        .populate('commented_by', 'personal_info.username personal_info.fullname personal_info.profile_img')
        .skip(page * skipNumber)
        .limit(maxLimit)
        .sort({ commentedAt: -1 });


    res.status(200).send({
        success: true,
        result,
        details: await res.getModelListDetails(Comment, { blog_id, isReply: false }).then((details: any) => details.pages)
    })

}


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

    // const newComment = new Comment({
    //     blog_id: _id,
    //     comment,
    //     commented_by: user_id,
    //     blog_author,
    // })

    // const commentedData = await newComment.save();

    let commentedData = await Comment.create({
        blog_id: _id,
        comment,
        commented_by: user_id,
        blog_author,
    }).then((data: any) => data.populate('commented_by', 'personal_info.username personal_info.fullname personal_info.profile_img'));

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

    res.status(201).send({
        success: true,
        result: commentedData
    })
}