"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("./user.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const blog_route_1 = __importDefault(require("./blog.route"));
const comment_route_1 = __importDefault(require("./comment.route"));
const notification_route_1 = __importDefault(require("./notification.route"));
const router = (0, express_1.Router)();
// authRoutes
router.use('/auth', auth_route_1.default);
// userRoutes
router.use("/users", user_route_1.default);
// blogRoutes
router.use("/blogs", blog_route_1.default);
// commentRoutes
router.use("/comments", comment_route_1.default);
// notificationRoutes
router.use("/comments", notification_route_1.default);
exports.default = router;
//# sourceMappingURL=index.route.js.map