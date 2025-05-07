"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotifications = exports.isExistNotification = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const common_1 = require("../utils/common");
const isExistNotification = async (req, res) => {
    const userId = req.user._id;
    const { category } = req.query;
    const filter = {
        notification_for: userId,
        seen: false,
        user: { $ne: userId },
    };
    if (typeof category === 'string' && category !== 'all')
        filter.type = category;
    const totalNotification = await notification_model_1.default.countDocuments(filter);
    res.status(200).json({
        success: true,
        isNewNotification: totalNotification > 0,
        totalNotification,
    });
};
exports.isExistNotification = isExistNotification;
const listNotifications = async (req, res) => {
    const userId = req.user._id;
    const { type, deletedDocCount } = req.query;
    const maxLimit = 10;
    const page = Math.max(0, Number(req.query.page) - 1 || 0);
    let skip = page * maxLimit;
    if (deletedDocCount)
        skip -= Number(deletedDocCount);
    const filter = {
        notification_for: userId,
        user: { $ne: userId },
    };
    if (typeof type === 'string' && type !== 'all')
        filter.type = type;
    const notifications = await notification_model_1.default.find(filter)
        .skip(skip)
        .limit(maxLimit)
        .populate('blog', 'title blog_id')
        .populate('user', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .populate('comment', 'comment')
        .populate('replied_on_comment', 'comment')
        .populate('reply', 'comment')
        .sort({ createdAt: -1 })
        .select('createdAt type seen reply');
    if (!notifications)
        throw new common_1.CustomError('No notifications found', 404, true);
    await notification_model_1.default.updateMany(filter, { seen: true }).skip(skip).limit(maxLimit);
    const pages = await res.getModelListDetails(notification_model_1.default, filter).then((details) => details.pages);
    res.status(200).json({
        success: true,
        details: pages,
        result: notifications,
    });
};
exports.listNotifications = listNotifications;
//# sourceMappingURL=notification.controller.js.map