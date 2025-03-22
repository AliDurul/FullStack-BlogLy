"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_1 = require("../controllers/blog");
const permissions_1 = require("../middlewares/permissions");
const router = (0, express_1.Router)();
// URL: /blogs
router.route('/')
    .get(blog_1.list)
    .post(permissions_1.isLogin, blog_1.create);
router.get('/trending', blog_1.trendingBlog);
router.route('/:id')
    .get(blog_1.read)
    .put(permissions_1.isLogin, blog_1.update)
    .delete(permissions_1.isLogin, blog_1.deletee);
router.get('/:id/like', blog_1.Like);
exports.default = router;
//# sourceMappingURL=blog.js.map