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
        ref: 'blogs'
    },
    notification_for: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    user: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    comment: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    },
    reply: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    },
    replied_on_comment: {
        type: dbConnection_1.mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.default = dbConnection_1.mongoose.model("notification", notificationSchema);
