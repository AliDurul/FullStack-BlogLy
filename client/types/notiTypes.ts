export interface INoti {
    _id: string;
    type: string;
    blog: Blog;
    user: NotiUser;
    comment: Comment;
    seen: boolean;
    createdAt: Date;
    replied_on_comment?: Comment
}

export interface Blog {
    _id: string;
    blog_id: string;
    title: string;
}

export interface Comment {
    _id: string;
    comment: string;
}

export interface NotiUser {
    personal_info: PersonalInfo;
    _id:string
}

export interface PersonalInfo {
    fullname: string;
    username: string;
    profile_img: string;
}
