import { pbkdf2Sync } from 'node:crypto';
import jwt from 'jsonwebtoken';
import compression from 'compression';
import { Request, Response } from 'express';
import { getTransporter } from '../configs/nodemailer';
import { ENV } from '../configs/env';
import { IUser } from '../types/user';

// ===============================
// 1. CUSTOM ERROR CLASS
// ===============================
export class CustomError extends Error {
    override name = "CustomError";
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = false) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
};


// ===============================
// 2. PASSWORD ENCRYPTION
// ===============================
export function passwordEncrypt(pass: string): string {

    const keyCode = ENV.secretKey;
    const loopCount = 10000;
    const charCount = 32;
    const encType = 'sha512';

    return pbkdf2Sync(pass, keyCode, loopCount, charCount, encType).toString('hex');
}


// ===============================
// 3. GENERATE CACHE KEY
// ===============================
export const generateCacheKey = (baseKey: string, query: Record<string, unknown>): string => {
    const queryParts = Object.keys(query || {})
        .sort()
        .map(key => `${key}=${JSON.stringify(query[key])}`)
        .join('&');

    return `${baseKey}?${queryParts}`;
};


// ===============================
// 4. GET OR SET CACHE
// ===============================


// ===============================
// 5. SET TOKEN
// ===============================
interface TokenResult {
    success: boolean;
    access: string;
    refresh: string | null;
}
export function setToken(user: IUser, isRefresh: boolean = false): TokenResult {

    const { user_id, _id, personal_info: { profile_img, username, fullname } } = user;

    const payload = {
        _id,
        user_id,
        profile_img,
        username,
        fullname
    };

    return {
        success: true,
        access: jwt.sign(payload, ENV.jwtSecret, { expiresIn: "1h" }),
        refresh: isRefresh ? null : jwt.sign({ id: user._id }, ENV.jwtRefreshSecret, { expiresIn: "1d" })
    }
};


// ===============================
// 6. SEND EMAIL
// ===============================
interface MailFrom {
    name: string;
    address: string;
}

interface SendMailOptions {
    to: string;
    subject: string;
    tempFn: (data?: any) => string;
    data?: any;
    from?: MailFrom;
    text?: string | null;
}

export const sendMail = async ({
    to,
    subject,
    tempFn,
    data = null,
    from = null,
    text = null
}: SendMailOptions): Promise<void> => {
    const transporter = getTransporter();

    const mailOptions = {
        from: from || { name: 'Your App', address: ENV.emailUser },
        to,
        subject,
        html: data ? tempFn(data) : tempFn(),
        text: text || undefined,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error: any) {
        console.error('Error sending email:', error);
        throw new CustomError(`Error sending email. Error ${error.message}`, 500, true);
    }
};


// ===============================
// 7. SHOULD COMPRESS
// ===============================
export function shouldCompress(req: Request, res: Response): boolean {
    if (req.headers['x-no-compression'] || req.query.nozip) {
        return false;
    }
    return compression.filter(req, res);
}