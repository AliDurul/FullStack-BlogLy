import { NextFunction } from "express";
import { Request, Response } from 'express-serve-static-core';
import { IUser } from "../types/user";
import { CustomError } from "../helpers/utils";



export const isLogin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;

    if (process.env.NODE_ENV === 'production' && !user) {
        throw new CustomError('You are not authorized to access this resource', 401);
    }

    next();
}
