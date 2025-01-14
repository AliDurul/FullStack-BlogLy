'use server'

import { auth } from "@/auth";
import { blogDraftSchema, blogPublishSchema, TBlogPublishSchema } from "../zod";

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