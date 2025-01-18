import { Router } from "express";
import { list, create, latestBlog, trendingBlog } from "../controllers/blog";
import { isLogin } from "../middlewares/permissions";

const router = Router();

router.route('/').get(list).post(isLogin, create);

router.get('/latest', latestBlog);
router.get('/trending', trendingBlog);


// router.get('/:id',read);

export default router;