import mongoose from 'mongoose';
import User from '../models/user';
import { Request, Response } from 'express-serve-static-core';
import 'express-async-errors';



export const list = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "List Users"
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
    
    const { username } = req.query

    let filter = {};

    if (username) filter = { 'personal_info.username': new RegExp(username as string, 'i') }


    const result = await User.find(filter).limit(50).select("personal_info.fullname personal_info.username personal_info.email personal_info.profile_img -_id")

    res.status(200).send({
        error: false,
        details: await res.getModelListDetails(User, filter),
        result
    })
}

export const read = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Get Single User"
    */

    const data = await User.findOne({ user_id: req.params.id })

    res.status(200).send({
        error: false,
        data
    })

}

export const update = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Update User"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "username": "test",
                "password": "1234",
                "email": "test@site.com",
                "firstName": "test",
                "lastName": "test",
            }
        }
    */

    // Admin olmayan başkasınıın kaydına erişemez:
    req.params.id = req.user.isAdmin ? req.params.id : req.user._id

    // const data = await User.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
    const data = await User.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

    res.status(202).send({
        error: false,
        data,
        new: await User.findOne({ _id: req.params.id })
    })

}

export const deletee = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Delete User"
    */

    const data = await User.deleteOne({ _id: req.params.id })

    res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data
    })

}