import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express-serve-static-core";

declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}

export default async (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers?.authorization || null
    const tokenKey = auth ? auth.split(' ') : null

    if (!process.env.ACCESS_KEY) throw new Error('ACCESS_KEY is not defined in the environment variables')

    if (tokenKey) {
        if (tokenKey[0] == 'Bearer') {
            jwt.verify(tokenKey[1], process.env.ACCESS_KEY, (err, userData) => {
                req.user = userData
            })
        }
    }

    next()
}