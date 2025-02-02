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
        ref: 'blogs'
    },
    notification_for: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    },
    replied_on_comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
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