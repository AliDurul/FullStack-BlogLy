"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.userDelete = exports.updateUserProfile = exports.updateProfileImg = exports.userRead = exports.userList = void 0;
const user_1 = __importDefault(require("../models/user"));
require("express-async-errors");
const utils_1 = require("../helpers/utils");
const passwordEncrypt_1 = __importDefault(require("../helpers/passwordEncrypt"));
const userList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { username } = req.query;
    let filter = {};
    if (username)
        filter = { 'personal_info.username': new RegExp(username, 'i') };
    const result = yield user_1.default.find(filter).limit(50).select("personal_info.fullname personal_info.username personal_info.email personal_info.profile_img -_id");
    if (!result)
        throw new utils_1.CustomError('Users not found ', 404);
    res.status(200).send({
        success: true,
        details: yield res.getModelListDetails(user_1.default, filter),
        result
    });
});
exports.userList = userList;
const userRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Get Single User"
    */
    const result = yield user_1.default.findOne({ 'personal_info.username': req.params.username })
        .select("-personal_info.password -google_auth -updatedAt -blogs");
    if (!result)
        throw new utils_1.CustomError('User not found with username: ' + req.params.username, 404);
    res.status(200).send({
        success: true,
        result
    });
});
exports.userRead = userRead;
const updateProfileImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { url } = req.body;
    const userId = req.user._id;
    const result = yield user_1.default.findOneAndUpdate({ _id: userId }, { "personal_info.profile_img": url });
    res.status(202).send({
        success: true,
        profile_img: url
    });
});
exports.updateProfileImg = updateProfileImg;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Update User"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "username": "test",
                "password": "1234",
                "email": "
                "firstName": "test",
                "lastName": "test",
    */
    const { username, bio, social_links } = req.body;
    const userId = req.user._id;
    if (!username)
        throw new utils_1.CustomError('Username is required', 400);
    if (username.length < 3)
        throw new utils_1.CustomError('Username must be at least 3 characters', 400);
    if (bio.length > 150)
        throw new utils_1.CustomError('Bio must be less than 150 characters', 400);
    const socaialLinksArr = Object.keys(social_links);
    for (let i = 0; i < socaialLinksArr.length; i++) {
        if (social_links[socaialLinksArr[i]].length) {
            let url = new URL(social_links[socaialLinksArr[i]]);
            let hostname = url.hostname;
            let href = url.href;
            if (!hostname.includes(`${socaialLinksArr[i]}.com`) && socaialLinksArr[i] !== 'website') {
                throw new utils_1.CustomError(`${socaialLinksArr[i]} link is invalid. You must enter a full link.`, 400);
            }
        }
    }
    const upadateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    };
    user_1.default.findOneAndUpdate({ _id: userId }, upadateObj, { new: true, runValidators: true })
        .then(result => {
        res.status(202).send({
            success: true,
            message: 'User updated successfully',
            result: { username: result === null || result === void 0 ? void 0 : result.personal_info.username, bio: result === null || result === void 0 ? void 0 : result.personal_info.bio, social_links: result === null || result === void 0 ? void 0 : result.social_links }
        });
    }).catch(err => {
        if (err.code === 11000) {
            throw new utils_1.CustomError('Username already exists', 400);
        }
    });
});
exports.updateUserProfile = updateUserProfile;
const userDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Delete User"
    */
    const data = yield user_1.default.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data
    });
});
exports.userDelete = userDelete;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        throw new utils_1.CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 403);
    const user = yield user_1.default.findById(userId);
    if (!user)
        throw new utils_1.CustomError('User not found', 404);
    if (user.OAuth)
        throw new utils_1.CustomError('You are using OAuth, you can not change password', 403);
    if (user.personal_info.password !== (0, passwordEncrypt_1.default)(currentPassword))
        throw new utils_1.CustomError('Current password is incorrect', 400);
    user.personal_info.password = (0, passwordEncrypt_1.default)(newPassword);
    yield user.save();
    res.status(202).send({
        success: true,
        message: 'Password changed successfully'
    });
});
exports.changePassword = changePassword;
//# sourceMappingURL=user.js.map