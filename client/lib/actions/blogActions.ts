'use server'

import { auth } from "@/auth";
import { blogPublishSchema, TBlogPublishSchema } from "../zod";

const API_URL = process.env.API_BASE_URL

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.access;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};


export const createBlog = async ( blog: TBlogPublishSchema) => {

    const headers = await authConfig();

    const res = await fetch(API_URL + '/blogs', {
        method: 'POST',
        body: JSON.stringify(blog),
        headers
    })

    if (!res.ok) {
        return {
            success: false,
            message: 'Failed to create blog',
        }
    }

    const data = await res.json();

    return {
        success: true,
        message: 'Blog created successfully',
        data
    }
}