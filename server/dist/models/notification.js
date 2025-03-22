"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("../configs/dbConnection");
const notificationSchema = new dbConnection_1.mongoose.Schema({
    type: {
        type: String,
        enum: ["like", "comment", "reply"],
        required: true
    },
    blog: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    notification_for: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comment: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    reply: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    replied_on_comment: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { collection: 'notifications',
    timestamps: true
});
exports.default = dbConnection_1.mongoose.model("Notification", notificationSchema);
//# sourceMappingURL=notification.js.map