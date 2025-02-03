'use server'

import { auth } from "@/auth";
import { blogDraftSchema, blogPublishSchema, commentSchema, TBlogPublishSchema } from "../zod";
import { IApiArrRes, IApiObjRes, TError } from "@/types";
import { ISingleBlog, ITrendingBlog } from "@/types/blogTypes";

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
    category: string,
    search: string,
    pageParam: string | number
    author?: string,
    limit?: string
    excludedId?: string
}

type TfetchBlogsFn = ({ category, search, pageParam, author, limit, excludedId }: TFetchBlogsProps) => Promise<IApiArrRes<ISingleBlog> | TError>

export const fetchBlogs: TfetchBlogsFn = async ({ category, search, pageParam, author, limit, excludedId }) => {

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    let url = `${API_URL}/blogs`;

    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (pageParam) params.append("page", pageParam as string)
    if (author) params.append("author", author);
    if (limit) params.append("limit", limit);
    if (excludedId) params.append("excludedId", excludedId);
    if (params.toString()) url += `?${params.toString()}`;

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

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    let url = `${API_URL}/blogs/${blogId}`;

    const params = new URLSearchParams();
    if (mode) params.append("mode", mode);
    if (params.toString()) url += `?${params.toString()}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
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

        console.log(data);

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

export const createComment = async (prevState: unknown, payload: FormData) => {


    const { _id, comment, blog_author } = Object.fromEntries(payload.entries());

    const commentObj = { _id, comment, blog_author };

    console.log(commentObj);
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

    return {
        success: true,
        message: 'Comment created successfully',
    }
}