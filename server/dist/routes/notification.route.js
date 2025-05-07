"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
// Base URL: /notifications
router.get('/', notification_controller_1.listNotifications);
router.get('/new', notification_controller_1.isExistNotification);
exports.default = router;
//# sourceMappingURL=notification.route.js.map