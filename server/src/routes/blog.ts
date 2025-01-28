import { Router } from "express";
import { list, create, trendingBlog, read } from "../controllers/blog";
import { isLogin } from "../middlewares/permissions";

const router = Router();

router.route('/')
    .get(list)
    .post(isLogin, create);

router.get('/:id',read);

router.get('/trending', trendingBlog);



export default router;