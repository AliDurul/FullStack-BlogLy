'use server'

import { auth } from "@/auth";
import { blogDraftSchema, blogPublishSchema, TBlogPublishSchema } from "../zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { IDetails, TError, TLatestBlogResponse } from "@/types";

const API_URL = process.env.API_BASE_URL

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.access;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};


export const createBlog = async (prevState: unknown, blog: TBlogPublishSchema) => {

    const headers = await authConfig();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let result;

    if (blog.draft) {
        result = blogDraftSchema.safeParse(blog);
    } else {
        result = blogPublishSchema.safeParse(blog);
    }

    if (!result.success) {
        return { success: false, errors: Object.values(result.error.flatten().fieldErrors) }
    }
    const res = await fetch(API_URL + '/blogs', {
        method: 'POST',
        body: JSON.stringify(result.data),
        headers
    })

    const data = await res.json();

    if (!res.ok && data.error) {
        return {
            success: false,
            errors: [data.message],
        }
    }

    return {
        success: true,
        message: 'Blog created successfully',
    }
}

type TFetchBlogsProps = {
    category: string,
    search: string,
    pageParam: string | number
    author?: string
}

export const fetchBlogs = async ({ category, search, pageParam, author }: TFetchBlogsProps) => {

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    let url = `${API_URL}/blogs`;

    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (pageParam) params.append("page", pageParam as string)
    if (author) params.append("author", author);
    if (params.toString()) url += `?${params.toString()}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            next: { tags: ['Blogs'] }
        },)

        const data = await res.json();

        if (!res.ok && data.error) {
            return {
                success: false,
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

export const fetchTrendingBlogs = async () => {

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const res = await fetch(API_URL + '/blogs/trending', {
            method: 'GET',
        })

        const data = await res.json();

        if (!res.ok && data.error) {
            return {
                success: false,
                errors: [data.message],
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