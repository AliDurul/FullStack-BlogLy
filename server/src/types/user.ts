import { Document, Types } from "mongoose";

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

export interface IUser extends Document {
    _id: string;
    user_id: string;
    personal_info: PersonalInfo;
    social_links: SocialLinks;
    account_info: AccountInfo;
    OAuth: boolean;
    blogs: Types.ObjectId[];
    isVerified: boolean;
    resetPassToken?: string;
    resetPassExpiresAt?: Date;
    verificationToken: string;
    verificationTokenExpiresAt: Date;
}

export interface IUserPayload {
    user_id: string;
    _id: string;
    profile_img: string;
    username: string;
    fullname: string;
}
