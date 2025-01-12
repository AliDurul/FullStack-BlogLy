import User from '../models/user';
import { CustomError } from '../helpers/utils';
import { Request, Response } from 'express-serve-static-core';
import passwordEncrypt from '../helpers/passwordEncrypt';
import { generateUsername, SetToken } from '../helpers/utils';
import jwt from 'jsonwebtoken';
import { IUser, IUserPayload } from '../types/user';
import 'express-async-errors';

export const login = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Login"
        #swagger.description = 'Login with username (or email) and password for get Token and JWT.'
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                "username": "test",
                "password": "1234",
            }
        }
    */

    const { email, password } = req.body

    if (!(email && password)) throw new CustomError('Please enter username/email and password.', 401)

    const user = await User.findOne({ 'personal_info.email': email }).lean()


    if (!user) throw new CustomError('User not found.', 404)

    if (user?.personal_info.password !== passwordEncrypt(password)) throw new CustomError('Wrong username/email or password.', 401)



    res.status(200).send(SetToken(user))

}

export const register = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Create User"
        #swagger.description = `
            Password Format Type: It must has min.1 lowercase, min.1 uppercase, min.1 number and min.1 specialChars.
        `
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

    const { fullname, email, password } = req.body

    let user;

    if (req.body.sub) {
        const { sub, fullname, email, picture, } = req.body;

        user = await User.findOne({ user_id: sub });

        if (user) return;

        user = await User.create({ user_id: sub, OAuth: true, personal_info: { fullname, email, profile_img: picture, username: await generateUsername(email) } })

    } else {

        if (!(fullname && email && password)) throw new CustomError('Please fill all fields.', 400)

        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) throw new CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 400)

        const username = await generateUsername(email)

        user = await User.create({ personal_info: { fullname, email, password: passwordEncrypt(password), username } })

    }

    res.status(201).send(SetToken(user))
}

export const refresh = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Authentication']
        #swagger.summary = 'JWT: Refresh'
        #swagger.description = 'Refresh access-token by refresh-token.'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                bearer: {
                    refresh: '___refreshToken___'
                }
            }
        }
    */

    const refreshToken = req.body?.refresh

    if (!refreshToken) throw new CustomError('Please enter token.refresh', 401)

    const refreshKey = process.env.REFRESH_KEY;

    if (!refreshKey) throw new CustomError('Refresh key is not defined.', 422);

    jwt.verify(refreshToken, refreshKey, async function (err: any, userData: any) {

        if (err) {
            throw err
        } else {
            const { user_id } = userData as IUserPayload

            if (!user_id) throw new CustomError('In token user_id  not found.', 404)

            const user: IUser | null = await User.findOne({ user_id }).lean()

            if (!user) throw new CustomError('User not found.', 404)

            res.status(200).send(SetToken(user, true))

        }

    })

}

export const logout = async (req: Request, res: Response) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Token: Logout"
        #swagger.description = 'Delete token-key.'
    */


    res.send({
        error: false,
        message: 'Logout success.',
    })
}