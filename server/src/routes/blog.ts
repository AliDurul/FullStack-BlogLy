import { Router } from "express";
import { list, create, latestBlog } from "../controllers/blog";
import { isLogin } from "../middlewares/permissions";

const router = Router();

router.route('/').get(list).post(isLogin, create);

router.get('/latest', latestBlog);


// router.get('/:id',read);

export default router;