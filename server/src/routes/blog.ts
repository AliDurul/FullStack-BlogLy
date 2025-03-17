import { Router } from "express";
import { list, create, trendingBlog, read, update, likeBlog, Like, deletee } from "../controllers/blog";
import { isLogin } from "../middlewares/permissions";

const router = Router();

// URL: /blogs

router.route('/')
    .get(list)
    .post(isLogin, create);

router.get('/trending', trendingBlog);

router.route('/:id')
    .get(read)
    .put(isLogin, update)
    .delete(isLogin, deletee);

router.get('/:id/like', Like);


export default router;