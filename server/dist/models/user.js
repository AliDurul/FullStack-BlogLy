"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("../configs/dbConnection");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const uuid_1 = require("uuid");
let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];
const UserSchema = new dbConnection_1.mongoose.Schema({
    user_id: {
        type: String,
        default: uuid_1.v4,
    },
    personal_info: {
        fullname: {
            type: String,
            lowercase: true,
            required: true,
            minlength: [3, 'fullname must be 3 letters long'],
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate: [
                (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
                'Please fill a valid email address'
            ],
            unique: true
        },
        password: {
            type: String,
            trim: true,
            // required: true,
            // set: (password) => passwordEncrypt(password),
        },
        username: {
            type: String,
            minlength: [3, 'Username must be 3 letters long'],
            unique: true,
        },
        bio: {
            type: String,
            maxlength: [200, 'Bio should not be more than 200'],
            default: "",
        },
        profile_img: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`;
            }
        },
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    account_info: {
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    OAuth: {
        type: Boolean,
        default: false
    },
    blogs: {
        type: [dbConnection_1.mongoose.Schema.Types.ObjectId],
        ref: 'Blog',
        default: [],
    }
}, {
    timestamps: { createdAt: 'joinedAt' },
    collection: 'users'
});
UserSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v;
        // ret.profile_img = ret.personal_info.profile_img;
        // ret.username = ret.personal_info.username;
        // ret.fullname = ret.personal_info.fullname;
        // delete ret.personal_info; // Optional: remove the original personal_info object if not needed
    }
});
UserSchema.plugin(mongoose_unique_validator_1.default, {
    message: "This {PATH} is exist",
});
exports.default = dbConnection_1.mongoose.model('User', UserSchema);
//# sourceMappingURL=user.js.map