import mongoose, { Document, Schema, Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = new Schema<IUser>({

  user_id: {
    type: String,
    default: uuidv4,
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
        (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
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
        return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list?.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list?.length)]}`
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
    linkedin: {
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
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Blog',
    default: [],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  resetPassToken: String,
  resetPassExpiresAt: Date,

  verificationToken: {
    type: String,
    default: () => Math.floor(100000 + Math.random() * 900000).toString()  // 6 digit code
  },

  verificationTokenExpiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
  }

}, {
  timestamps: { createdAt: 'joinedAt' },
  collection: 'users'
})


const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;

export interface IUser extends Document {
  _id: string;
  user_id: string;
  personal_info: PersonalInfo;
  social_links: SocialLinks;
  account_info: AccountInfo;
  OAuth: boolean;
  blogs: Schema.Types.ObjectId[];
  isVerified: boolean;
  resetPassToken?: string;
  resetPassExpiresAt?: Date;
  verificationToken: string;
  verificationTokenExpiresAt: Date;
};

export interface PersonalInfo {
  fullname: string;
  email: string;
  password?: string;
  username?: string;
  bio?: string;
  profile_img?: string;
}

export interface SocialLinks {
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface AccountInfo {
  total_posts: number;
  total_reads: number;
}

export interface IUserPayload {
  user_id: string;
  _id: string;
  profile_img: string;
  username: string;
  fullname: string;
}