"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const common_1 = require("../middlewares/common");
const validation_schemas_1 = require("../utils/validation.schemas");
const router = (0, express_1.Router)();
// URL: /blogs
router.route('/')
    .get(blog_controller_1.getBlogs)
    .post((0, common_1.isValidated)(validation_schemas_1.createBlogSchema), blog_controller_1.createBlog);
router.get('/trending', blog_controller_1.trendingBlog);
router.route('/:id')
    .get(blog_controller_1.getBlogById)
    .put(blog_controller_1.updateBlog)
    .delete(blog_controller_1.deleteBlog);
router.get('/:id/like', blog_controller_1.toggleLike);
exports.default = router;
//# sourceMappingURL=blog.route.js.map