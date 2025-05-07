"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const router = (0, express_1.Router)();
// URL: /comments
router.route('/').post(comment_controller_1.createComment);
router.route('/:blog_id').get(comment_controller_1.listRelatedComments).delete(comment_controller_1.deleteComment);
router.route('/replies/:parentId/').get(comment_controller_1.listReplies);
exports.default = router;
//# sourceMappingURL=comment.route.js.map