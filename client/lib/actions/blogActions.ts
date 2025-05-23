'use server'

import { auth } from "@/auth";
import { blogDraftSchema, blogPublishSchema, commentSchema, TBlogPublishSchema } from "../zod";
import { IApiArrRes, IApiObjRes, TError } from "@/types";
import { ISingleBlog, ITrendingBlog } from "@/types/blogTypes";
import { revalidatePath, revalidateTag } from "next/cache";

const API_URL = process.env.API_BASE_URL

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.access;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};



export const createOupdateBlog = async (prevState: unknown, blog: TBlogPublishSchema) => {

    const headers = await authConfig();

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    let result;

    if (blog.draft) {
        result = blogDraftSchema.safeParse(blog);
    } else {
        result = blogPublishSchema.safeParse(blog);
    }

    if (!result.success) {
        return { success: false, errors: Object.values(result.error.flatten().fieldErrors) }
    }


    let res;
    const url = API_URL + '/blogs';

    if (blog._id) {
        res = await fetch(url + `/${blog._id}`, {
            method: 'PUT',
            body: JSON.stringify(result.data),
            headers
        })
    } else {
        res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(result.data),
            headers
        })
    }

    const data = await res.json();

    if (!res.ok && !data.success) {
        return {
            success: data.success,
            errors: [data.message],
        }
    }

    return {
        success: true,
        message: 'Blog created successfully',
    }
}

interface TFetchBlogsProps {
    category?: string;
    search?: string;
    pageParam: string | number;
    author?: string;
    limit?: string;
    excludedId?: string;
    draft?: string
}

type TfetchBlogsFn = ({ category, search, pageParam, author, limit, excludedId, draft }: TFetchBlogsProps) => Promise<IApiArrRes<ISingleBlog> | TError>

export const fetchBlogs: TfetchBlogsFn = async ({ category, search, pageParam, author, limit, excludedId, draft }) => {

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    let url = `${API_URL}/blogs`;

    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (pageParam) params.append("page", pageParam as string)
    if (author) params.append("author", author);
    if (draft) params.append("draft", draft);
    if (limit) params.append("limit", limit);
    if (excludedId) params.append("excludedId", excludedId);
    if (params.toString()) url += `?${params.toString()}`;

    // console.log('url-', url)

    try {
        const res = await fetch(url, {
            method: 'GET',
            next: { tags: ['Blogs'] }
        },)

        const data = await res.json();

        if (!res.ok && !data.success) {
            return {
                success: data.success,
                message: data.message,
            }
        }

        return data
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        }
    }


}

type TfetchBlogFn = (blogId: string, mode?: string) => Promise<IApiObjRes<ISingleBlog> | TError>

export const fetchBlog: TfetchBlogFn = async (blogId, mode) => {

    let url = `${API_URL}/blogs/${blogId}`;

    const params = new URLSearchParams();
    if (mode) params.append("mode", mode);
    if (params.toString()) url += `?${params.toString()}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            next: { tags: ['Blog'] }
        })

        const data = await res.json();

        if (!res.ok && !data.success) {
            return {
                success: data.success,
                message: data.message,
            }
        }

        return data
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        }
    }


};

type TdeleteBlogFn = (_: unknown, blogId: string) => Promise<TError>

export const deleteBlog: TdeleteBlogFn = async (_, blogId) => {

    await new Promise((resolve) => setTimeout(resolve, 1000));

    let url = `${API_URL}/blogs/${blogId}`;

    const headers = await authConfig();

    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers,
            next: { tags: ['DeleteBlog'] }
        })


        if (res.status === 204) {
            return {
                success: true,
                message: 'Blog deleted successfully',
            };
        }

        const data = await res.json();

        if (!res.ok) {
            return {
                success: data.success,
                message: data.message,
            };
        }


        return {
            success: true,
            message: 'Blog deleted successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        }
    }
};

type TfetchTrendingBlogsFn = () => Promise<IApiArrRes<ITrendingBlog> | TError>

export const fetchTrendingBlogs: TfetchTrendingBlogsFn = async () => {

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const res = await fetch(API_URL + '/blogs/trending', {
            method: 'GET',
        })

        const data = await res.json();

        if (!res.ok && !data.success) {
            return {
                success: data.success,
                message: data.message,
            }
        }

        return data

    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        }
    }


}

type TlikeBlogFn = (_: unknown, blogId: string,) => Promise<IApiObjRes<{ likesCount: number }> | TError>

export const likeBLog: TlikeBlogFn = async (_, blogId) => {

    const headers = await authConfig();

    let url = `${API_URL}/blogs/${blogId}/like`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers
        },)

        const data = await res.json();

        if (!res.ok && !data.success) {
            return {
                success: data.success,
                message: data.message,
            }
        }

        return data
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        }
    }


}

export const createComment = async (_: unknown, payload: FormData) => {


    const { _id, comment, blog_author, replying_to, notification_id } = Object.fromEntries(payload.entries());

    const commentObj = { _id, comment, blog_author, replying_to, notification_id };

    const result = commentSchema.safeParse(commentObj);


    if (!result.success) {
        return { success: false, errors: result.error.flatten().fieldErrors }
    }

    const url = API_URL + '/comments';
    const headers = await authConfig();

    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(result.data),
        headers
    })


    const data = await res.json();

    if (!res.ok && !data.success) {
        return {
            success: data.success,
            errors: { comment: data.message },
        }
    }

    return data
}

export const fetchCommentsOfBlog = async (blogId: string, pageParam: string | number) => {

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    let url = `${API_URL}/comments/${blogId}`;

    const params = new URLSearchParams();
    if (pageParam) params.append("page", pageParam as string)

    if (params.toString()) url += `?${params.toString()}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            next: { tags: ['Comments'] }
        })

        const data = await res.json();

        if (!res.ok && !data.success) {
            return {
                success: data.success,
                message: data.message,
            }
        }

        return data

    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        }
    }


}

export const fetchRepliesOfComment = async (commentId: string) => {

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    let url = `${API_URL}/comments/replies/${commentId}`;

    // const params = new URLSearchParams();
    // if (pageParam) params.append("page", pageParam as string)

    // if (params.toString()) url += `?${params.toString()}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            next: { tags: ['CommentReplies'] }
        })

        const data = await res.json();

        if (!res.ok && !data.success) {
            return {
                success: data.success,
                message: data.message,
            }
        }

        return data

    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        }
    }


}

export const deleteComment = async (_: unknown, commentId: string) => {

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let url = `${API_URL}/comments/${commentId}`;

    const headers = await authConfig();

    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers,
            next: { tags: ['deleteComment'] }
        })

        const data = await res.json();

        if (!res.ok && !data.success) {
            return {
                success: data.success,
                message: data.message,
            }
        }

        return data

    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        }
    }


}