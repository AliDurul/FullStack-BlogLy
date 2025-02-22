export interface INoti {
    _id: string;
    type: string;
    blog: Blog;
    user: User;
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

export interface User {
    personal_info: PersonalInfo;
}

export interface PersonalInfo {
    fullname: string;
    username: string;
    profile_img: string;
}
