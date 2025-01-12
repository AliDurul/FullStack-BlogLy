import Blog from '../models/blog';
import { Request, Response } from 'express-serve-static-core';
import { IBlog } from '../types/blog';
import CustomError from '../helpers/customError';
import { nanoid } from 'nanoid';
import User from '../models/user';
import { mongoose } from '../configs/dbConnection';

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
    console.log(req.user);

    if(!author) throw new CustomError('Author not found', 404)

    if (!title || !banner || (!des && des.length > 200) || !content.blocks.length || (!tags.length && tags.length > 10)) {
        throw new CustomError('Title, banner, description, content and tags fields are required ', 400);
    }

    tags = tags.map((tag: string) => tag.toLowerCase());
    
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