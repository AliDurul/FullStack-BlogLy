/* Common Interfaces */

export interface IPersonalInfo {
    fullname: string;
    email: string;
    username: string;
    profile_img: string;
    bio: string;
}

export interface ISocialLinks {
    youtube: string;
    instagram: string;
    linkedIn: string;
    twitter: string;
    github: string;
    website: string;
}

export interface IAccountInfo {
    total_posts: number;
    total_reads: number;
}

/* Search User */
export interface ISearchUser {
    personal_info: IPersonalInfo;
}

/* Get single user */
export interface IUser {
    personal_info: IPersonalInfo;
    social_links: ISocialLinks;
    account_info: IAccountInfo;
    _id: string;
    OAuth: boolean;
    user_id: string;
    joinedAt: Date;
}
