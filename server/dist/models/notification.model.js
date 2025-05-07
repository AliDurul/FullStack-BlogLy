"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const notificationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['like', 'comment', 'reply'],
        required: true,
    },
    blog: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    notification_for: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    reply: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    replied_on_comment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    seen: {
        type: Boolean,
        default: false,
    },
}, {
    collection: 'notifications',
    timestamps: true,
});
const Notification = (0, mongoose_1.model)('Notification', notificationSchema);
exports.default = Notification;
//# sourceMappingURL=notification.model.js.map