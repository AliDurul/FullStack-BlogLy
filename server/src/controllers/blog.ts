import { Request, Response } from 'express-serve-static-core';
import { IBlogfindOneAndUpdateFn, IBlog } from '../types/blog';
import { CustomError } from '../helpers/utils';
import { nanoid } from 'nanoid';
import User from '../models/user';
import Blog from '../models/blog';
import 'express-async-errors';
import Notification from '../models/notification';
import Comment from '../models/comment';


export const list = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "List Blogs"
        #swagger.description = `
            You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
            <ul> Examples:
                <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                <li>URL/?<b>limit=10&page=1</b></li>
            </ul>
        `
    */


    // Queries
    const { search, category, author, limit, excludedId, draft } = req.query;

    const maxLimit = Number(limit) || Number(process.env.PAGE_SIZE) || 10;


    // pagination
    let page = Number(req.query.page)
    page = page > 0 ? (page - 1) : 0

    // Custom Filter
    let filter: any = { draft: false };

    if (category) filter = { ...filter, tags: { $in: [category] }, blog_id: { $ne: excludedId } }
    if (search) filter = { ...filter, title: new RegExp(search as string, 'i') }
    if (author) {
        if (draft == 'true') {
            filter = { ...filter, draft: true, author }
        } else {
            filter = { ...filter, author }
        }
    }

    // db request
    const result = await Blog.find(filter)
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ publishedAt: -1 })
        .select('blog_id title des publishedAt banner tags activity -_id')
        .skip(page * maxLimit)
        .limit(maxLimit)

    res.status(200).send({
        success: true,
        details: await res.getModelListDetails(Blog, filter).then((details: any) => details.pages),
        result
    })
}

export const create = async (req: Request, res: Response) => {

    /*
       #swagger.tags = ["Blogs"]
       #swagger.summary = "Update Blog"
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               
           }
       }
   */

    let { title, banner, des, content, tags, draft } = req.body;
    const author = req.user._id;

    if (!author) throw new CustomError('Author not found.', 404)

    const validations = [
        { condition: !title, message: 'Title is required.' },
        { condition: !banner, message: 'Banner is required.' },
        { condition: !des || des?.length > 200, message: 'Description is required and should not exceed 200 characters.' },
        { condition: !content?.length, message: 'Content is required.' },
        { condition: !tags?.length || tags?.length > 10, message: 'Tags are required and should not exceed 10.' },
    ];

    if (!draft) {
        for (const { condition, message } of validations) {
            if (condition) {
                throw new CustomError(message, 400);
            }
        }
    }

    tags = tags?.map((tag: string) => tag.toLowerCase());

    const blog_id = title.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid(2);

    const blog = await Blog.create({ blog_id, title, banner, des, content, tags, author, draft: !!draft });

    if (!blog) throw new CustomError('Blog could not be created', 400);

    const incrementVal = draft ? 0 : 1;

    const user = await User.updateOne(
        { _id: author },
        {
            $inc: { "account_info.total_posts": incrementVal },
            $push: { "blogs": blog._id }
        },
        { new: true }  // Return updated document
    );

    if (!user.modifiedCount) throw new CustomError('User could not be updated', 404);

    res.status(201).send({
        error: false,
        id: blog.blog_id,
    });
}

export const read = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Get Single Blog"
    */

    const { id } = req.params;
    const { mode } = req.query

    const incrementVal = mode !== 'edit' ? 1 : 0;

    const result: IBlogfindOneAndUpdateFn = await Blog
        .findOneAndUpdate({ blog_id: id }, { $inc: { "activity.total_reads": incrementVal } })
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .select('title des content banner activity publishedAt blog_id tags');

    if (!result) throw new CustomError('Blog not found.', 404);

    await User.findOneAndUpdate({ 'personal_info.username': result.author.personal_info.username }, { $inc: { "account_info.total_reads": incrementVal } })


    // throw an error if the blog is a draft query is draft


    res.status(200).send({
        success: true,
        result
    })

}

export const update = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Update Blog"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true, 
            schema: {
                
            }
        }
    */


    const result = await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })

    res.status(202).send({
        success: true
    })

}

export const deletee = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Delete Blog"
    */

    const blog_id = req.params.id;

    const blog = await Blog.findOneAndDelete({ blog_id }) as unknown as IBlog | null;

    if (!blog) {
        throw new CustomError('Blog not found', 404);
    }

    await Notification.deleteMany({ blog: blog._id });
    console.log('Notifications deleted');

    await Comment.deleteMany({ blog_id: blog._id });
    console.log('Comments deleted');

    await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { blogs: blog._id }, $inc: { 'account_info.total_posts': -1 } }
    );
    console.log('Blog Deleted');

    res.sendStatus(204);

};

export const trendingBlog = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Get Trending Blog"
    */

    const result = await Blog.find({ draft: false })
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select('blog_id title  publishedAt -_id')
        .limit(5);

    if (!result) throw new CustomError('Trending Blogs not found.', 404);

    res.status(200).send({
        success: true,
        result
    })


}

export const likeBlog = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Like Blog"
    */

    const { id } = req.params;

    const { isLikedByUser } = req.query;

    const incrementVal = isLikedByUser === 'true' ? -1 : 1;


    const blog = await Blog.findOneAndUpdate({ _id: id }, { $inc: { "activity.total_likes": incrementVal } })

    if (!blog) throw new CustomError('Blog not found and not liked.', 404);

    if (!isLikedByUser) {
        const like = new Notification({
            type: 'like',
            user: req.user._id,
            blog: id,
            notification_for: blog.author
        })

        const notification = await like.save();

        if (!notification) throw new CustomError('Notification could not be created.', 400);

        res.status(202).send({
            success: true,
            liked_by_user: true
        })
    } else {
        res.status(202).send({
            success: true,
            liked_by_user: false
        })
    }



};

export const Like = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Add or Remove Like from a Blog"
        #swagger.description = "This endpoint allows a user to add or remove their like from a specific blog post."
        #swagger.parameters['id'] = {
            description: "ID of the blog post",
            required: true,
            type: "string",
            in: "path"
        }

    */
    const blogId = req.params.id;
    const userId = req.user._id;


    const blog = await Blog.findById(blogId);

    if (!blog) throw new CustomError("Blog not found", 404);


    if (blog._id.toString() === userId.toString()) throw new CustomError("You cannot like your own blog", 400);


    const likeIndex = blog.activity.likes.indexOf(userId);

    if (likeIndex === -1) {
        blog.activity.likes.push(userId);
    } else {
        blog.activity.likes.splice(likeIndex, 1);
    }

    await blog.save();

    res.status(200).send({
        success: true,
        // message: likeIndex === -1 ? "Like added" : "Like removed",
        result: {
            likesCount: blog.activity.likes.length,
        },
    });
};

