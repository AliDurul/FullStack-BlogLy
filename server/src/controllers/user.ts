import User from '../models/user';
import { Request, Response } from 'express-serve-static-core';
import 'express-async-errors';
import { CustomError } from '../helpers/utils';
import passwordEncrypt from '../helpers/passwordEncrypt';



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

    if (!result) throw new CustomError('Users not found ', 404)


    res.status(200).send({
        success: true,
        details: await res.getModelListDetails(User, filter),
        result
    })
}

export const read = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Get Single User"
    */

    const result = await User.findOne({ 'personal_info.username': req.params.username })
        .select("-personal_info.password -google_auth -updatedAt -blogs")

    if (!result) throw new CustomError('User not found with username: ' + req.params.username, 404)

    res.status(200).send({
        success: true,
        result
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

export const changePassword = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Change Password"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "currentPassword": "1234",
                "newPassword": "12345",
            }
        }
    */

    const { currentPassword, newPassword } = req.body
    const userId = req.user._id

    if ((!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(currentPassword)) || (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(newPassword))) throw new CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 403)

    const user = await User.findById(userId)

    if (!user) throw new CustomError('User not found', 404)

    if (user.OAuth) throw new CustomError('You are using OAuth, you can not change password', 403);

    if (user.personal_info.password !== passwordEncrypt(currentPassword)) throw new CustomError('Current password is incorrect', 400)

    user.personal_info.password = passwordEncrypt(newPassword)
    await user.save()

    res.status(202).send({
        success: true,
        message: 'Password changed successfully'
    })

}