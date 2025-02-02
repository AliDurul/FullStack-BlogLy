import { Router } from "express";
import { list, create, trendingBlog, read, update, likeBlog } from "../controllers/blog";
import { isLogin } from "../middlewares/permissions";

const router = Router();

router.route('/')
    .get(list)
    .post(isLogin, create);

router.get('/trending', trendingBlog);

router.route('/:id').get(read).put(isLogin, update);

router.get('/:id/like', likeBlog)




export default router;