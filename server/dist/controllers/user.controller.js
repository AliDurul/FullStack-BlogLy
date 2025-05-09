"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.updateProfileImg = exports.getUserByUsername = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const common_1 = require("../utils/common");
const getUsers = async (req, res) => {
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
    const result = await user_model_1.default.find(filter).limit(50).select("personal_info.fullname personal_info.username personal_info.email personal_info.profile_img -_id").lean();
    res.send({
        success: true,
        details: await res.getModelListDetails(user_model_1.default, filter),
        result,
    });
};
exports.getUsers = getUsers;
const getUserByUsername = async (req, res) => {
    /*
       #swagger.tags = ["Users"]
       #swagger.summary = "Get Single User"
    */
    const { username } = req.params;
    const result = await user_model_1.default.findOne({ 'personal_info.username': username })
        .select("-personal_info.password -google_auth -updatedAt -blogs").lean();
    if (!result)
        throw new common_1.CustomError('User not found with username: ' + req.params.username, 404, true);
    res.status(200).send({
        success: true,
        result,
    });
};
exports.getUserByUsername = getUserByUsername;
const updateProfileImg = async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Update Profile Image"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "url": "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=adventurer-neutral",
            }
        }
    */
    const { url } = req.body;
    const userId = req.user._id;
    const result = await user_model_1.default.findOneAndUpdate({ _id: userId }, { "personal_info.profile_img": url }).lean();
    res.status(202).send({
        success: true,
        profile_img: result.personal_info.profile_img,
    });
};
exports.updateProfileImg = updateProfileImg;
const updateUser = async (req, res) => {
    const { username, bio, social_links } = req.body;
    const userId = req.user._id;
    if (!username)
        throw new common_1.CustomError('Username is required', 400, true);
    if (username.length < 3)
        throw new common_1.CustomError('Username must be at least 3 characters', 400, true);
    if (bio && bio.length > 150)
        throw new common_1.CustomError('Bio must be less than 150 characters', 400, true);
    if (social_links) {
        for (const [key, value] of Object.entries(social_links)) {
            if (value?.length) {
                const url = new URL(value);
                const hostname = url.hostname;
                if (!hostname.includes(`${key}.com`) && key !== 'website') {
                    throw new common_1.CustomError(`${key} link is invalid. You must enter a full link.`, 400, true);
                }
            }
        }
    }
    const updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    };
    const updatedUser = await user_model_1.default.findOneAndUpdate({ _id: userId }, updateObj, { new: true, runValidators: true });
    if (!updatedUser) {
        throw new common_1.CustomError('User not found', 404, true);
    }
    res.status(202).send({
        success: true,
        message: 'User updated successfully',
        result: {
            username: updatedUser.personal_info.username,
            bio: updatedUser.personal_info.bio,
            social_links: updatedUser.social_links,
        },
    });
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const data = await user_model_1.default.deleteOne({ _id: id });
    if (!data.deletedCount)
        throw new common_1.CustomError("User not found or already deleted.", 404, true);
    res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data
    });
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map