"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLike = exports.trendingBlog = exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.createBlog = exports.getBlogs = void 0;
const blog_model_1 = __importDefault(require("../models/blog.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const crypto_1 = require("crypto");
const common_1 = require("../utils/common");
const getPagination = (req) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    return { skip: (page - 1) * limit, limit };
};
const getBlogs = async (req, res) => {
    const { search, category, author, excludedId, draft } = req.query;
    const { skip, limit } = getPagination(req);
    const filter = { draft: false };
    if (category)
        filter.tags = { $in: [category] };
    if (excludedId)
        filter.blog_id = { $ne: excludedId };
    if (search)
        filter.title = new RegExp(String(search), 'i');
    if (author) {
        filter.author = author;
        if (draft === 'true')
            filter.draft = true;
    }
    const result = await blog_model_1.default.find(filter)
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ publishedAt: -1 })
        .select('blog_id title des publishedAt banner tags activity -_id')
        .skip(skip)
        .limit(limit);
    const details = await res.getModelListDetails(blog_model_1.default, filter);
    res.status(200).send({
        success: true,
        details: details.pages,
        result
    });
};
exports.getBlogs = getBlogs;
const createBlog = async (req, res) => {
    const { title, banner, des, content, tags, draft } = req.body;
    const author = req.user._id;
    // if (!author) throw new CustomError('Author not found.', 404, true);
    // if (!draft) {
    //     if (!title) throw new CustomError('Title is required.', 400, true);
    //     if (!banner) throw new CustomError('Banner is required.', 400, true);
    //     if (!des || des.length > 200) throw new CustomError('Description is required and should not exceed 200 characters.', 400);
    //     if (!content?.length) throw new CustomError('Content is required.', 400);
    //     if (!tags?.length || tags.length > 10) throw new CustomError('Tags are required and should not exceed 10.', 400);
    // }
    const processedTags = tags?.map((tag) => tag.toLowerCase());
    const blog_id = `${title.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, '-').trim()}-${(0, crypto_1.randomUUID)().slice(0, 2)}`;
    const blog = await blog_model_1.default.create({ blog_id, title, banner, des, content, tags: processedTags, author, draft: !!draft });
    if (!blog)
        throw new common_1.CustomError('Blog could not be created', 400, true);
    const userUpdate = await user_model_1.default.updateOne({ _id: author }, {
        $inc: { "account_info.total_posts": draft ? 0 : 1 },
        $push: { blogs: blog._id }
    });
    if (!userUpdate.modifiedCount)
        throw new common_1.CustomError('User could not be updated', 404, true);
    res.status(201).send({
        error: false,
        id: blog.blog_id
    });
};
exports.createBlog = createBlog;
const getBlogById = async (req, res) => {
    const { id } = req.params;
    const { mode } = req.query;
    const incrementVal = mode !== 'edit' ? 1 : 0;
    const blog = await blog_model_1.default
        .findOneAndUpdate({ blog_id: id }, { $inc: { "activity.total_reads": incrementVal } }, { new: true })
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .select('title des content banner activity publishedAt blog_id tags');
    if (!blog)
        throw new common_1.CustomError('Blog not found.', 404, true);
    await user_model_1.default.findOneAndUpdate({ 'personal_info.username': blog.author.personal_info.username }, { $inc: { "account_info.total_reads": incrementVal } });
    res.status(200).send({ success: true, result: blog });
};
exports.getBlogById = getBlogById;
const updateBlog = async (req, res) => {
    const blog = await blog_model_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true });
    if (!blog)
        throw new common_1.CustomError('Blog not found.', 404, true);
    res.status(202).send({ success: true });
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    const blog_id = req.params.id;
    const blog = await blog_model_1.default.findOneAndDelete({ blog_id });
    if (!blog)
        throw new common_1.CustomError('Blog not found', 404, true);
    await Promise.all([
        notification_model_1.default.deleteMany({ blog: blog._id }),
        comment_model_1.default.deleteMany({ blog_id: blog._id }),
        user_model_1.default.findOneAndUpdate({ _id: req.user._id }, { $pull: { blogs: blog._id }, $inc: { 'account_info.total_posts': -1 } })
    ]);
    res.sendStatus(204);
};
exports.deleteBlog = deleteBlog;
const trendingBlog = async (req, res) => {
    const blogs = await blog_model_1.default.find({ draft: false })
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ "activity.total_read": -1, "activity.total_likes": -1, publishedAt: -1 })
        .select('blog_id title publishedAt -_id')
        .limit(5);
    if (!blogs.length)
        throw new common_1.CustomError('Trending Blogs not found.', 404, true);
    res.status(200).send({ success: true, result: blogs });
};
exports.trendingBlog = trendingBlog;
const toggleLike = async (req, res) => {
    const blogId = req.params.id;
    const userId = req.user._id;
    const blog = await blog_model_1.default.findById(blogId);
    if (!blog)
        throw new common_1.CustomError("Blog not found", 404, true);
    if (blog.author._id.toString() === userId.toString())
        throw new common_1.CustomError("You cannot like your own blog", 400, true);
    const likeIndex = blog.activity.likes.indexOf(userId);
    likeIndex === -1 ? blog.activity.likes.push(userId) : blog.activity.likes.splice(likeIndex, 1);
    await blog.save();
    res.status(200).send({
        success: true,
        result: { likesCount: blog.activity.likes.length }
    });
};
exports.toggleLike = toggleLike;
// export const likeBlog = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const isLiked = req.query.isLikedByUser === 'true';
//     const incrementVal = isLiked ? -1 : 1;
//     const blog: IBlog | null = await Blog.findOneAndUpdate({ _id: id }, { $inc: { "activity.total_likes": incrementVal } });
//     if (!blog) throw new CustomError('Blog not found.', 404, true);
//     if (!isLiked) {
//         const notification = await new Notification({
//             type: 'like',
//             user: req.user._id,
//             blog: id,
//             notification_for: blog.author
//         }).save();
//         if (!notification) throw new CustomError('Notification could not be created.', 400, true);
//     }
//     res.status(202).send({
//         success: true,
//         liked_by_user: !isLiked
//     });
// };
//# sourceMappingURL=blog.controller.js.map