import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IUser } from '../types/user';



export const generateUsername = async (email: string) => {
    let username = email.split('@')[0]
    let isUnique = await User.exists({ 'personal_info.username': username })

    isUnique ? username += Math.floor(Math.random() * 1000) : ''
    return username
}

export const SetToken = (user: IUser, isRefresh: boolean = false) => {

    const { user_id, _id, personal_info: { profile_img, username, fullname } } = user;
    
    const payload = {
        _id,
        user_id,
        profile_img,
        username,
        fullname
    };
    // JWT:
    if (!process.env.ACCESS_KEY || !process.env.REFRESH_KEY) {
        throw new Error('Environment variables ACCESS_KEY and REFRESH_KEY must be defined');
    }

    const access = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '1d' });
    const refresh = isRefresh ? null : jwt.sign({ _id: user._id }, process.env.REFRESH_KEY, { expiresIn: '3d' });

    return { error: false, access, refresh }
}


export class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode || 500;
    }
}
