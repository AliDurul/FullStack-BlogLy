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
exports.Like = exports.likeBlog = exports.trendingBlog = exports.deletee = exports.update = exports.read = exports.create = exports.list = void 0;
const utils_1 = require("../helpers/utils");
const nanoid_1 = require("nanoid");
const user_1 = __importDefault(require("../models/user"));
const blog_1 = __importDefault(require("../models/blog"));
require("express-async-errors");
const notification_1 = __importDefault(require("../models/notification"));
const comment_1 = __importDefault(require("../models/comment"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "List Blogs"
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
    // Queries
    const { search, category, author, limit, excludedId, draft } = req.query;
    const maxLimit = Number(limit) || Number(process.env.PAGE_SIZE) || 10;
    // pagination
    let page = Number(req.query.page);
    page = page > 0 ? (page - 1) : 0;
    // Custom Filter
    let filter = { draft: false };
    if (category)
        filter = Object.assign(Object.assign({}, filter), { tags: { $in: [category] }, blog_id: { $ne: excludedId } });
    if (search)
        filter = Object.assign(Object.assign({}, filter), { title: new RegExp(search, 'i') });
    if (author) {
        if (draft == 'true') {
            filter = Object.assign(Object.assign({}, filter), { draft: true, author });
        }
        else {
            filter = Object.assign(Object.assign({}, filter), { author });
        }
    }
    // db request
    const result = yield blog_1.default.find(filter)
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ publishedAt: -1 })
        .select('blog_id title des publishedAt banner tags activity -_id')
        .skip(page * maxLimit)
        .limit(maxLimit);
    res.status(200).send({
        success: true,
        details: yield res.getModelListDetails(blog_1.default, filter).then((details) => details.pages),
        result
    });
});
exports.list = list;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
       #swagger.tags = ["Blogs"]
       #swagger.summary = "Update Blog"
       #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               
           }
       }
   */
    let { title, banner, des, content, tags, draft } = req.body;
    const author = req.user._id;
    if (!author)
        throw new utils_1.CustomError('Author not found.', 404);
    const validations = [
        { condition: !title, message: 'Title is required.' },
        { condition: !banner, message: 'Banner is required.' },
        { condition: !des || (des === null || des === void 0 ? void 0 : des.length) > 200, message: 'Description is required and should not exceed 200 characters.' },
        { condition: !(content === null || content === void 0 ? void 0 : content.length), message: 'Content is required.' },
        { condition: !(tags === null || tags === void 0 ? void 0 : tags.length) || (tags === null || tags === void 0 ? void 0 : tags.length) > 10, message: 'Tags are required and should not exceed 10.' },
    ];
    if (!draft) {
        for (const { condition, message } of validations) {
            if (condition) {
                throw new utils_1.CustomError(message, 400);
            }
        }
    }
    tags = tags === null || tags === void 0 ? void 0 : tags.map((tag) => tag.toLowerCase());
    const blog_id = title.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, '-').trim() + (0, nanoid_1.nanoid)(2);
    const blog = yield blog_1.default.create({ blog_id, title, banner, des, content, tags, author, draft: !!draft });
    if (!blog)
        throw new utils_1.CustomError('Blog could not be created', 400);
    const incrementVal = draft ? 0 : 1;
    const user = yield user_1.default.updateOne({ _id: author }, {
        $inc: { "account_info.total_posts": incrementVal },
        $push: { "blogs": blog._id }
    }, { new: true } // Return updated document
    );
    if (!user.modifiedCount)
        throw new utils_1.CustomError('User could not be updated', 404);
    res.status(201).send({
        error: false,
        id: blog.blog_id,
    });
});
exports.create = create;
const read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Get Single Blog"
    */
    const { id } = req.params;
    const { mode } = req.query;
    const incrementVal = mode !== 'edit' ? 1 : 0;
    const result = yield blog_1.default
        .findOneAndUpdate({ blog_id: id }, { $inc: { "activity.total_reads": incrementVal } })
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .select('title des content banner activity publishedAt blog_id tags');
    if (!result)
        throw new utils_1.CustomError('Blog not found.', 404);
    yield user_1.default.findOneAndUpdate({ 'personal_info.username': result.author.personal_info.username }, { $inc: { "account_info.total_reads": incrementVal } });
    // throw an error if the blog is a draft query is draft
    res.status(200).send({
        success: true,
        result
    });
});
exports.read = read;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Update Blog"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                
            }
        }
    */
    const result = yield blog_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true });
    res.status(202).send({
        success: true
    });
});
exports.update = update;
const deletee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Delete Blog"
    */
    const blog_id = req.params.id;
    const blog = yield blog_1.default.findOneAndDelete({ blog_id });
    if (!blog) {
        throw new utils_1.CustomError('Blog not found', 404);
    }
    yield notification_1.default.deleteMany({ blog: blog._id });
    console.log('Notifications deleted');
    yield comment_1.default.deleteMany({ blog_id: blog._id });
    console.log('Comments deleted');
    yield user_1.default.findOneAndUpdate({ _id: req.user._id }, { $pull: { blogs: blog._id }, $inc: { 'account_info.total_posts': -1 } });
    console.log('Blog Deleted');
    res.sendStatus(204);
});
exports.deletee = deletee;
const trendingBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Get Trending Blog"
    */
    const result = yield blog_1.default.find({ draft: false })
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select('blog_id title  publishedAt -_id')
        .limit(5);
    if (!result)
        throw new utils_1.CustomError('Trending Blogs not found.', 404);
    res.status(200).send({
        success: true,
        result
    });
});
exports.trendingBlog = trendingBlog;
const likeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Like Blog"
    */
    const { id } = req.params;
    const { isLikedByUser } = req.query;
    const incrementVal = isLikedByUser === 'true' ? -1 : 1;
    const blog = yield blog_1.default.findOneAndUpdate({ _id: id }, { $inc: { "activity.total_likes": incrementVal } });
    if (!blog)
        throw new utils_1.CustomError('Blog not found and not liked.', 404);
    if (!isLikedByUser) {
        const like = new notification_1.default({
            type: 'like',
            user: req.user._id,
            blog: id,
            notification_for: blog.author
        });
        const notification = yield like.save();
        if (!notification)
            throw new utils_1.CustomError('Notification could not be created.', 400);
        res.status(202).send({
            success: true,
            liked_by_user: true
        });
    }
    else {
        res.status(202).send({
            success: true,
            liked_by_user: false
        });
    }
});
exports.likeBlog = likeBlog;
const Like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Add or Remove Like from a Blog"
        #swagger.description = "This endpoint allows a user to add or remove their like from a specific blog post."
        #swagger.parameters['id'] = {
            description: "ID of the blog post",
            required: true,
            type: "string",
            in: "path"
        }

    */
    const blogId = req.params.id;
    const userId = req.user._id;
    const blog = yield blog_1.default.findById(blogId);
    if (!blog)
        throw new utils_1.CustomError("Blog not found", 404);
    if (blog._id.toString() === userId.toString())
        throw new utils_1.CustomError("You cannot like your own blog", 400);
    const likeIndex = blog.activity.likes.indexOf(userId);
    if (likeIndex === -1) {
        blog.activity.likes.push(userId);
    }
    else {
        blog.activity.likes.splice(likeIndex, 1);
    }
    yield blog.save();
    res.status(200).send({
        success: true,
        // message: likeIndex === -1 ? "Like added" : "Like removed",
        result: {
            likesCount: blog.activity.likes.length,
        },
    });
});
exports.Like = Like;
//# sourceMappingURL=blog.js.map