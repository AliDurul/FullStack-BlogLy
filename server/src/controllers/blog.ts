import Blog from '../models/blog';
import { Request, Response } from 'express-serve-static-core';
import { IBlog } from '../types/blog';
import { CustomError } from '../helpers/utils';
import { nanoid } from 'nanoid';
import User from '../models/user';
import { mongoose } from '../configs/dbConnection';
import 'express-async-errors';


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
    throw new CustomError('Title, banner, description, content and tags fields are required ', 401);


    const data = await res.getModelList(Blog)


    res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Blog),
        data,
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

    const data = await Blog.findOne({ blog_id: req.params.id })

    res.status(200).send({
        error: false,
        data
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

    // Admin olmayan başkasınıın kaydına erişemez:
    req.params.id = req.user.isAdmin ? req.params.id : req.user._id

    // const data = await Blog.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
    const data = await Blog.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

    res.status(202).send({
        error: false,
        data,
        new: await Blog.findOne({ _id: req.params.id })
    })

}

export const deletee = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Delete Blog"
    */

    const data = await Blog.deleteOne({ _id: req.params.id })

    res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data
    })

}

export const latestBlog = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Get Latest Blog"
    */


    const maxLimit = Number(process.env.PAGE_SIZE) || 3;

    // pagination
    let page = Number(req.query.page)
    page = page > 0 ? (page - 1) : 0

    // Custom Filter
    const { category, } = req.query
    let filter: any = { draft: false };
    if (category) filter = { ...filter, tags: { $in: [category] } }

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

    res.status(200).send({
        success: true,
        result
    })


}