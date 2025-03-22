"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_1 = require("../controllers/comment");
const router = (0, express_1.Router)();
// URL: /comments
router.route('/').post(comment_1.createComment);
router.route('/:blog_id').get(comment_1.listRelatedCommets).delete(comment_1.deleteComment);
router.route('/replies/:parentId/').get(comment_1.listReplies);
exports.default = router;
//# sourceMappingURL=comment.js.map