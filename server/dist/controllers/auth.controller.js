"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgetPassword = exports.verifyEmail = exports.logout = exports.refresh = exports.login = exports.register = exports.generateUsername = void 0;
const env_1 = require("../configs/env");
const user_model_1 = __importDefault(require("../models/user.model"));
const common_1 = require("../utils/common");
const email_templates_1 = require("../utils/email.templates");
const node_crypto_1 = __importDefault(require("node:crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateUsername = async (email) => {
    let username = email.split('@')[0];
    let isUnique = await user_model_1.default.exists({ 'personal_info.username': username });
    isUnique ? username += Math.floor(Math.random() * 1000) : '';
    return username;
};
exports.generateUsername = generateUsername;
const register = async (req, res) => {
    const { email, fullname, password } = req.body;
    let user = null;
    if (req.body.sub) {
        const { sub, fullname, email, picture, github_link, bio } = req.body;
        user = await user_model_1.default.findOne({ user_id: sub });
        if (!user) {
            user = await user_model_1.default.create({ user_id: sub, OAuth: true, isVerified: true, personal_info: { bio, fullname, email, profile_img: picture, username: await (0, exports.generateUsername)(email) }, social_links: { github: github_link } });
        }
        ;
    }
    else {
        // if (!(fullname && email && password)) throw new CustomError('Please fill all fields.', 400, true)
        // if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) throw new CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 400, true);
        const exists = await user_model_1.default.exists({ email });
        if (exists)
            throw new common_1.CustomError('User already exists with this email', 409);
        const username = await (0, exports.generateUsername)(email);
        user = await user_model_1.default.create({ personal_info: { fullname, email, password: (0, common_1.passwordEncrypt)(password), username } });
    }
    ;
    if (!user.OAuth) {
        await (0, common_1.sendMail)({
            to: user.personal_info.email,
            subject: 'Blogly - Verify your email',
            tempFn: email_templates_1.verificationEmailTemp,
            data: { verificationCode: user.verificationToken }
        });
    }
    ;
    const response = user.OAuth ? (0, common_1.setToken)(user) : {
        success: true,
        message: 'User created successfully. Please check your email to verify your account in 2 hours time.',
    };
    res.status(201).send(response);
};
exports.register = register;
const login = async (req, res) => {
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
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({ 'personal_info.email': email });
    if (!user)
        throw new common_1.CustomError('User not found with this email.', 401, true);
    if (user?.personal_info.password !== (0, common_1.passwordEncrypt)(password))
        throw new common_1.CustomError('The password is wrong. You forget password ?', 401, true);
    if (!user.isVerified)
        throw new common_1.CustomError('Email not verified. Check your inbox to verify your email.', 403, true);
    res.status(201).send((0, common_1.setToken)(user));
};
exports.login = login;
const refresh = async (req, res) => {
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
    const refreshToken = req.body?.refresh;
    if (!refreshToken)
        throw new common_1.CustomError('Please enter token.refresh', 401, true);
    const decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.ENV.jwtRefreshSecret);
    if (!decoded?._id)
        throw new common_1.CustomError('Invalid token: missing id.', 403, true);
    const user = await user_model_1.default.findOne({ user_id: decoded._id }).lean();
    if (!user)
        throw new common_1.CustomError('User not found.', 404, true);
    res.status(200).send((0, common_1.setToken)(user, true));
};
exports.refresh = refresh;
const logout = async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Token: Logout"
        #swagger.description = 'Delete token-key.'
    */
    res.status(200).send({ success: true, message: 'Logged out successfully' });
};
exports.logout = logout;
const verifyEmail = async (req, res) => {
    const { verificationToken } = req.body;
    const user = await user_model_1.default.findOne({ verificationToken, verificationTokenExpiresAt: { $gt: new Date() } });
    if (!user)
        throw new common_1.CustomError('Invalid or expired verification token', 400, true);
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    (0, common_1.sendMail)({
        to: user.personal_info.email,
        subject: 'Blogly - Email verified successfully',
        tempFn: email_templates_1.welcomeEmailTemp,
        data: { name: user.personal_info.fullname }
    });
    res.status(200).send({
        success: true,
        message: 'Email verified successfully'
    });
};
exports.verifyEmail = verifyEmail;
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await user_model_1.default.findOne({ "personal_info.email": email });
    if (!user)
        throw new common_1.CustomError('User not found', 404, true);
    if (!user.isVerified)
        throw new common_1.CustomError('User email is not verified. Please verify your email.', 403, true);
    if (user.OAuth)
        throw new common_1.CustomError('You are using OAuth, you can not reset password', 403, true);
    user.resetPassToken = node_crypto_1.default.randomBytes(20).toString('hex');
    user.resetPassExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours later
    await user.save();
    await (0, common_1.sendMail)({
        to: user.personal_info.email,
        subject: 'Blogly - Reset your password',
        tempFn: email_templates_1.passResetReqTemp,
        data: { resetURL: env_1.ENV.frontendUrl + '/auth/reset-password/?resetPassToken=' + user.resetPassToken }
    });
    res.status(200).send({
        success: true,
        message: 'Password reset link sent to your email'
    });
};
exports.forgetPassword = forgetPassword;
const resetPassword = async (req, res) => {
    const { resetPassToken } = req.params;
    const { password } = req.body;
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password))
        throw new common_1.CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 400, true);
    const user = await user_model_1.default.findOne({ resetPassToken, resetPassExpiresAt: { $gt: new Date() } });
    if (!user)
        throw new common_1.CustomError('Invalid or expired reset token', 400);
    user.personal_info.password = (0, common_1.passwordEncrypt)(password);
    user.resetPassToken = undefined;
    user.resetPassExpiresAt = undefined;
    await user.save();
    await (0, common_1.sendMail)({
        to: user.personal_info.email,
        subject: 'Blogly - Password reset successfully',
        tempFn: email_templates_1.passResetSuccessTemp
    });
    res.status(200).send({
        success: true,
        message: 'Password reset successfully'
    });
};
exports.resetPassword = resetPassword;
const changePassword = async (req, res) => {
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
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    if ((!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(currentPassword)) || (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(newPassword)))
        throw new common_1.CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 403, true);
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new common_1.CustomError('User not found', 404, true);
    if (user.OAuth)
        throw new common_1.CustomError('You are using OAuth, you can not change password', 403, true);
    if (user.personal_info.password !== (0, common_1.passwordEncrypt)(currentPassword))
        throw new common_1.CustomError('Current password is incorrect', 400, true);
    user.personal_info.password = (0, common_1.passwordEncrypt)(newPassword);
    await user.save();
    res.status(202).send({
        success: true,
        message: 'Password changed successfully'
    });
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map