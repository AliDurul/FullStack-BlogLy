import { Request, Response, NextFunction } from 'express';
import { ENV } from '../configs/env';
import User, { IUser } from '../models/user.model';
import { CustomError, passwordEncrypt, sendMail, setToken } from '../utils/common';
import { passResetReqTemp, passResetSuccessTemp, verificationEmailTemp, welcomeEmailTemp } from '../utils/email.templates';
import crypto from 'node:crypto';
import { TForgetPass, TLoginUser, TRegisterUser, TResetPass, TVerifyEmail } from '../utils/validation.schemas';
import jwt from 'jsonwebtoken';

export const generateUsername = async (email: string) => {
    let username = email.split('@')[0]
    let isUnique = await User.exists({ 'personal_info.username': username })

    isUnique ? username += Math.floor(Math.random() * 1000) : ''
    return username
}

export const register = async (req: Request, res: Response): Promise<void> => {
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

    const { email, fullname, password } = req.body as TRegisterUser;

    let user: IUser | null = null;

    if (req.body.sub) {
        const { sub, fullname, email, picture } = req.body;

        user = await User.findOne({ user_id: sub });

        if (user) return;

        user = await User.create({ user_id: sub, OAuth: true, personal_info: { fullname, email, profile_img: picture, username: await generateUsername(email) } })

    } else {
        if (!(fullname && email && password)) throw new CustomError('Please fill all fields.', 400, true)

        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) throw new CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 400, true);

        const exists = await User.exists({ email });

        if (exists) throw new CustomError('User already exists with this email', 409);

        const username = await generateUsername(email)

        user = await User.create({ personal_info: { fullname, email, password: passwordEncrypt(password), username } })
    }


    await sendMail({
        to: user.personal_info.email,
        subject: 'Verify your email',
        tempFn: verificationEmailTemp,
        data: { verificationCode: user.verificationToken }
    });
    // message: 'Please check your email to verify your account',

    res.status(201).send(setToken(user));
    /*  */
};

export const login = async (req: Request, res: Response): Promise<void> => {
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
    const { email, password } = req.body as TLoginUser;

    const user = await User.findOne({ 'personal_info.email': email });

    if (!user) throw new CustomError('Invalid email', 401, true);

    if (user?.personal_info.password !== passwordEncrypt(password)) throw new CustomError('Wrong password.', 401, true);

    user.verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationTokenExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    await user.save();

    await sendMail({
        to: user.personal_info.email,
        subject: 'Verify your email',
        tempFn: verificationEmailTemp,
        data: { verificationCode: user.verificationToken }
    });

    if (!user.isVerified) throw new CustomError('Email not verified. Check your inbox to verify your email.', 403, true);

    res.status(201).send(setToken(user));
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
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

    const refreshToken: string | undefined = req.body?.refresh

    if (!refreshToken) throw new CustomError('Please enter token.refresh', 401, true);

    const decoded = jwt.verify(refreshToken, ENV.jwtRefreshSecret) as { _id: string };

    if (!decoded?._id) throw new CustomError('Invalid token: missing id.', 403, true);


    const user: IUser | null = await User.findOne({ user_id: decoded._id }).lean();

    if (!user) throw new CustomError('User not found.', 404, true);

    res.status(200).send(setToken(user, true))
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {

    const { verificationToken } = req.body as TVerifyEmail;

    const user = await User.findOne<IUser>({ verificationToken, verificationTokenExpiresAt: { $gt: new Date() } });

    if (!user) throw new CustomError('Invalid or expired verification token', 400, true);

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    sendMail({
        to: user.personal_info.email,
        subject: 'Email verified successfully',
        tempFn: welcomeEmailTemp
    });

    res.status(200).send({
        success: true,
        message: 'Email verified successfully'
    });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Token: Logout"
        #swagger.description = 'Delete token-key.'
    */

    res.status(200).send({ success: true, message: 'Logged out successfully' });
};

export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body as TForgetPass;

    const user = await User.findOne<IUser>({ "personal_info.email": email });

    if (!user) throw new CustomError('User not found', 404, true);

    if (!user.isVerified) throw new CustomError('User email is not verified. Please verify your email.', 403, true);

    user.resetPassToken = crypto.randomBytes(20).toString('hex');

    user.resetPassExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours later

    await user.save();

    await sendMail({
        to: user.personal_info.email,
        subject: 'Reset your password',
        tempFn: passResetReqTemp,
        data: { resetURL: ENV.frontendUrl + '/reset-password/' + user.resetPassToken }
    });

    res.status(200).send({
        success: true,
        message: 'Password reset link sent to your email'
    });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { resetPassToken } = req.params;
    const { password } = req.body as TResetPass;

    const user = await User.findOne<IUser>({ resetPassToken, resetPassExpiresAt: { $gt: new Date() } });

    if (!user) throw new CustomError('Invalid or expired reset token', 400);

    user.personal_info.password = password;
    user.resetPassToken = undefined;
    user.resetPassExpiresAt = undefined;
    await user.save();

    await sendMail({
        to: user.personal_info.email,
        subject: 'Password reset successfully',
        tempFn: passResetSuccessTemp
    });

    res.status(200).send({
        success: true,
        message: 'Password reset successfully'
    });
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
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

    if ((!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(currentPassword)) || (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(newPassword))) throw new CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 403, true)

    const user = await User.findById(userId)

    if (!user) throw new CustomError('User not found', 404, true)

    if (user.OAuth) throw new CustomError('You are using OAuth, you can not change password', 403, true);

    if (user.personal_info.password !== passwordEncrypt(currentPassword)) throw new CustomError('Current password is incorrect', 400, true)

    user.personal_info.password = passwordEncrypt(newPassword)
    await user.save()

    res.status(202).send({
        success: true,
        message: 'Password changed successfully'
    })

};