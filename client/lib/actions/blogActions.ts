'use server'

import { auth } from "@/auth";
import { blogDraftSchema, blogPublishSchema, TBlogPublishSchema } from "../zod";
import { revalidatePath } from "next/cache";

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

export const fetchLatestBlogs = async ({ category, query }: { category: string, query: string }) => {

    await new Promise((resolve) => setTimeout(resolve, 3000));

    let url = `${API_URL}/blogs/latest`;

    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (query) params.append("query", query);
    if (params.toString()) url += `?${params.toString()}`;

    try {
        const res = await fetch(url, {
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

export const fetchTrendingBlogs = async () => {

    await new Promise((resolve) => setTimeout(resolve, 1000));

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