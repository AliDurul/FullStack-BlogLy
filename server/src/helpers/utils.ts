import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IUser } from '../types/user';



export const generateUsername = async (email: string) => {
    let username = email.split('@')[0]
    let isUnique = await User.exists({ 'personal_info.username': username })

    isUnique ? username += Math.floor(Math.random() * 1000) : ''
    return username
}

export const SetToken = (user: any, isRefresh: boolean = false) => {

    const { profile_img, username, fullname } = user.personal_info;
    const payload = {
        profile_img,
        username,
        fullname
    };
    // JWT:
    if (!process.env.ACCESS_KEY || !process.env.REFRESH_KEY) {
        throw new Error('Environment variables ACCESS_KEY and REFRESH_KEY must be defined');
    }

    const access = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '30m' });
    const refresh = isRefresh ? null : jwt.sign({ _id: user._id }, process.env.REFRESH_KEY, { expiresIn: '3d' });

    return { error: false, access, refresh }
}