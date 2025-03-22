"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotifications = exports.isExistNotification = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const isExistNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { category } = req.query;
    let filter = { notification_for: userId, seen: false, user: { $ne: userId } };
    if (typeof category === 'string' && category !== 'all')
        filter.type = category;
    // const isNewNotification = await Notification.exists(filter);
    const totalNotification = yield notification_1.default.countDocuments(filter);
    res.status(200).send({
        success: true,
        isNewNotification: !!totalNotification,
        totalNotification: totalNotification
    });
});
exports.isExistNotification = isExistNotification;
const listNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { type } = req.query;
    const deletedDocCount = (_a = req.query) === null || _a === void 0 ? void 0 : _a.deletedDocCount;
    // pagination
    const maxLimit = 10;
    let page = Number(req.query.page);
    page = page > 0 ? (page - 1) : 0;
    let skip = page * maxLimit;
    const filter = { notification_for: userId, user: { $ne: userId } };
    if (typeof type === 'string' && type !== 'all')
        filter.type = type;
    if (deletedDocCount)
        skip -= Number(deletedDocCount);
    const result = yield notification_1.default.find(filter)
        .skip(skip)
        .limit(maxLimit)
        .populate('blog', 'title blog_id')
        .populate('user', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .populate('comment', 'comment')
        .populate('replied_on_comment', 'comment')
        .populate('reply', 'comment')
        .sort({ createdAt: -1 })
        .select('createdAt type seen reply');
    notification_1.default.updateMany(filter, { seen: true })
        .skip(skip)
        .limit(maxLimit)
        .then(() => console.log('notification seen'));
    res.status(200).send({
        success: true,
        details: yield res.getModelListDetails(notification_1.default, filter).then((details) => details.pages),
        result
    });
});
exports.listNotifications = listNotifications;
//# sourceMappingURL=notification.js.map