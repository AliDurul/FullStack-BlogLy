import { mongoose } from "../configs/dbConnection";
import { INotification } from "../types/notification";


const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["like", "comment", "reply"],
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    notification_for: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    replied_on_comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    seen: {
        type: Boolean,
        default: false
    }
},
    {   collection: 'notifications',
        timestamps: true
    }
)

export default mongoose.model<INotification>("Notification", notificationSchema)