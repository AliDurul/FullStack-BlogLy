"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_1 = require("../controllers/notification");
const router = (0, express_1.Router)();
// URL: /notifications
router.get('/', notification_1.listNotifications);
router.get('/new', notification_1.isExistNotification);
exports.default = router;
//# sourceMappingURL=notification.js.map