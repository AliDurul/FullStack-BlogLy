import { CustomError } from "../helpers/utils";
import { Request, Response } from 'express-serve-static-core';
import Comment from "../models/comment";
import blog from "../models/blog";
import Notification from "../models/notification";

const populateChildren = (path = 'children') => {
    return {
        path,
        populate: {
            path: 'commented_by',
            select: 'personal_info.username personal_info.fullname personal_info.profile_img'
        },
        options: {
            populate: {
                path: 'children',
                populate: {
                    path: 'commented_by',
                    select: 'personal_info.username personal_info.fullname personal_info.profile_img'
                },
                options: {
                    populate: {
                        path: 'children',
                        populate: {
                            path: 'commented_by',
                            select: 'personal_info.username personal_info.fullname personal_info.profile_img'
                        },
                        options: {
                            populate: {
                                path: 'children',
                                populate: {
                                    path: 'commented_by',
                                    select: 'personal_info.username personal_info.fullname personal_info.profile_img'
                                },
                                options: {
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
        .populate(populateChildren())
        .skip(page * skipNumber)
        .limit(maxLimit)
        .sort({ commentedAt: -1 });


    res.status(200).send({
        success: true,
        result,
        details: await res.getModelListDetails(Comment, { blog_id, isReply: false }).then((details: any) => details.pages)
    })

};

export const listReplies = async (req: Request, res: Response) => {
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


    const result = await Comment.findOne({ _id: parentId })
        .populate(populateChildren())
        .select('childeren')
        .then((doc: any) => { return doc.children })
    
    res.status(200).send({
        success: true,
        result
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

    const { _id, comment, blog_author, replying_to } = req.body;

    if (comment.length < 1) throw new CustomError('Comment cannot be empty.', 400);

    let commentObj: { blog_id: string; comment: string; commented_by: string; blog_author: string; parent?: string, isReply?: boolean } = {
        blog_id: _id,
        comment,
        commented_by: user_id,
        blog_author,
    }

    if (replying_to) {
        const parentComment = await Comment.findById(replying_to);
        if (!parentComment) throw new CustomError('Parent comment does not exist.', 400);
        commentObj.parent = parentComment?._id
        commentObj.isReply = true;
    }

    let commentedData = await Comment.create(commentObj).then((data: any) => data.populate('commented_by', 'personal_info.username personal_info.fullname personal_info.profile_img'));

    if (!commentedData) throw new CustomError('Comment could not be created.', 400);

    await blog.findByIdAndUpdate(_id, { $push: { "activity.comments": commentedData._id }, $inc: { "activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1 } });

    interface INotification {
        type: string;
        blog: string;
        notification_for: string | undefined;
        user: string;
        comment: string;
        replied_on_comment?: string;
    }

    let notificationObj: INotification = {
        type: replying_to ? 'reply' : 'comment',
        blog: _id,
        notification_for: blog_author,
        user: user_id,
        comment: commentedData._id

    }

    if (replying_to) {
        notificationObj.replied_on_comment = replying_to;

        await Comment.findOneAndUpdate(
            { _id: replying_to },
            { $push: { children: commentedData._id } },
            { new: true }
        ).then((data: any) => {
            notificationObj.notification_for = data?.commented_by;
            // data.populate('commented_by', 'personal_info.username personal_info.fullname personal_info.profile_img')
        });

    }

    await Notification.create(notificationObj);


    res.status(201).send({
        success: true,
        result: commentedData
    })
}