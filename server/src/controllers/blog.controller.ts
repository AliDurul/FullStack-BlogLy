import { Request, Response } from 'express';
import Blog, { Author, IBlog } from '../models/blog.model';
import User from '../models/user.model';
import Notification from '../models/notification.model';
import Comment from '../models/comment.model';
import { randomUUID } from 'crypto';
import { CustomError } from '../utils/common';

const getPagination = (req: Request) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    return { skip: (page - 1) * limit, limit };
};

export const getBlogs = async (req: Request, res: Response) => {
    const { search, category, author, excludedId, draft } = req.query;
    const { skip, limit } = getPagination(req);


    const filter: Record<string, any> = { draft: false };

    if (category) filter.tags = { $in: [String(category).toLowerCase()] };
    if (excludedId) filter.blog_id = { $ne: excludedId };
    if (search) filter.title = new RegExp(String(search), 'i');
    if (author) {
        filter.author = author;
        if (draft === 'true') filter.draft = true;
    }
    // console.log('filter--->', filter);
    const result = await Blog.find(filter)
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ publishedAt: -1 })
        .select('blog_id title des publishedAt banner tags activity -_id')
        .skip(skip)
        .limit(limit);

    if (!result.length) {
        throw new CustomError('No blogs found matching the criteria.', 404, true);
    }

    const details = await res.getModelListDetails(Blog, filter);

    res.status(200).send({
        success: true,
        details: details.pages,
        result
    });
};

export const createBlog = async (req: Request, res: Response) => {
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

    const processedTags = tags?.map((tag: string) => tag.toLowerCase());
    const blog_id = `${title.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, '-').trim()}-${randomUUID().slice(0, 2)}`;

    const blog = await Blog.create({ blog_id, title, banner, des, content, tags: processedTags, author, draft: !!draft });
    if (!blog) throw new CustomError('Blog could not be created', 400, true);

    const userUpdate = await User.updateOne(
        { _id: author },
        {
            $inc: { "account_info.total_posts": draft ? 0 : 1 },
            $push: { blogs: blog._id }
        }
    );

    if (!userUpdate.modifiedCount) throw new CustomError('User could not be updated', 404, true);

    res.status(201).send({
        error: false,
        id: blog.blog_id
    });
};

export const getBlogById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { mode } = req.query;
    const incrementVal = mode !== 'edit' ? 1 : 0;

    const blog: (IBlog & { author: Author }) | null = await Blog
        .findOneAndUpdate({ blog_id: id }, { $inc: { "activity.total_reads": incrementVal } }, { new: true })
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .select('title des content banner activity publishedAt blog_id tags');

    if (!blog) throw new CustomError('Blog not found.', 404, true);

    await User.findOneAndUpdate(
        { 'personal_info.username': blog.author.personal_info.username },
        { $inc: { "account_info.total_reads": incrementVal } }
    );

    res.status(200).send({ success: true, result: blog });
};

export const updateBlog = async (req: Request, res: Response) => {
    const blog = await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true });
    if (!blog) throw new CustomError('Blog not found.', 404, true);
    res.status(202).send({ success: true });
};

export const deleteBlog = async (req: Request, res: Response) => {
    const blog_id = req.params.id;

    const blog: IBlog | null = await Blog.findOneAndDelete({ blog_id });
    if (!blog) throw new CustomError('Blog not found', 404, true);

    await Promise.all([
        Notification.deleteMany({ blog: blog._id }),
        Comment.deleteMany({ blog_id: blog._id }),
        User.findOneAndUpdate(
            { _id: req.user._id },
            { $pull: { blogs: blog._id }, $inc: { 'account_info.total_posts': -1 } }
        )
    ]);

    res.sendStatus(204);
};

export const trendingBlog = async (req: Request, res: Response) => {

    // const blogs: IBlog[] | null = await Blog.find({ draft: false })
    //     .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
    //     .sort({ "activity.total_reads": -1, publishedAt: -1 })
    //     .select('blog_id title publishedAt -_id')
    //     .limit(5);

    const blogs: IBlog[] | null = await Blog.aggregate([
        { $match: { draft: false } },
        {
            $addFields: {
                likesCount: { $size: "$activity.likes" }
            }
        },
        {
            $sort: {
                "activity.total_reads": -1,
                likesCount: -1,
                publishedAt: -1
            }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $unwind: "$author"
        },
        {
            $project: {
                blog_id: 1,
                title: 1,
                publishedAt: 1,
                "author.personal_info.profile_img": 1,
                "author.personal_info.username": 1,
                "author.personal_info.fullname": 1,
                _id: 0,
                activity: 1
            }
        }
    ]);

    if (!blogs.length) throw new CustomError('Trending Blogs not found.', 404, true);

    res.status(200).send({ success: true, result: blogs });
};

export const toggleLike = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog: (IBlog & { author: Author }) | null = await Blog.findById(blogId);
    if (!blog) throw new CustomError("Blog not found", 404, true);

    if (blog.author.toString() === userId.toString()) throw new CustomError("You cannot like your own blog", 400, true);

    const likeIndex = blog.activity.likes.indexOf(userId);
    likeIndex === -1 ? blog.activity.likes.push(userId) : blog.activity.likes.splice(likeIndex, 1);

    await blog.save();

    res.status(200).send({
        success: true,
        result: { likesCount: blog.activity.likes.length }
    });
};

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
