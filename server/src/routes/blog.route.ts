import { Router } from "express";
import { getBlogs, createBlog, trendingBlog, getBlogById, updateBlog, toggleLike, deleteBlog } from "../controllers/blog.controller";
import { isValidated } from "../middlewares/common";
import { createBlogSchema, getBlogQueriesSchema } from "../utils/validation.schemas";

const router = Router();

// URL: /blogs

router.route('/')
    .get(isValidated(getBlogQueriesSchema, 'query'), getBlogs)
    .post(isValidated(createBlogSchema), createBlog);

router.get('/trending', trendingBlog);

router.route('/:id')
    .get(getBlogById)
    .put(updateBlog)
    .delete(deleteBlog);

router.get('/:id/like', toggleLike);


export default router;