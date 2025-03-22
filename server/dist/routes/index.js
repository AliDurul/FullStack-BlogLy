"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_1 = __importDefault(require("./document"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const blog_1 = __importDefault(require("./blog"));
const comment_1 = __importDefault(require("./comment"));
const notification_1 = __importDefault(require("./notification"));
const upload_1 = __importDefault(require("./upload"));
const router = (0, express_1.Router)();
/* ------------------------------------------------------- */
// auth
router.use('/auth', auth_1.default);
// users
router.use('/users', user_1.default);
// blogs
router.use('/blogs', blog_1.default);
// comments
router.use('/comments', comment_1.default);
// notifications
router.use('/notifications', notification_1.default);
// comments
router.use('/upload-url', upload_1.default);
// document:
router.use('/documents', document_1.default);
/* ------------------------------------------------------- */
exports.default = router;
//# sourceMappingURL=index.js.map