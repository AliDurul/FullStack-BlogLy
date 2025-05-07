import { z } from 'zod';

export const registerUserSchema = z.object({
    fullname: z.string().min(1, 'Fullname is required').max(50, 'Fullname must be less than 50 characters'),
    email: z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters'),
}).strict();
export type TRegisterUser = z.infer<typeof registerUserSchema>;


export const loginUserSchema = z.object({
    email: z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters'),
}).strict();
export type TLoginUser = z.infer<typeof loginUserSchema>;


export const verifyEmailSchema = z.object({
    verificationToken: z.string().length(6, 'Verification token must be 6 digits long')
}).strict();
export type TVerifyEmail = z.infer<typeof verifyEmailSchema>;


export const forgetPassSchema = z.object({
    email: z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
}).strict();
export type TForgetPass = z.infer<typeof forgetPassSchema>;


export const resetPassSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters')
}).strict();
export type TResetPass = z.infer<typeof resetPassSchema>;


export const updateUserSchema = z.object({
    personal_info: z.object({
        fullname: z.string().min(3, 'fullname must be 3 letters long').toLowerCase(),
        email: z.string().email('Please fill a valid email address').toLowerCase(),
        bio: z.string().max(200, 'Bio should not be more than 200'),
    }),
    social_links: z.object({
        youtube: z.string().url().optional(),
        instagram: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        twitter: z.string().url().optional(),
        github: z.string().url().optional(),
        website: z.string().url().optional(),
    }),
}).strict();
export type TUpdateUser = z.infer<typeof resetPassSchema>;


export const createBlogSchema = z.object({
    author: z.string().nonempty('Author is required.'),
    draft: z.boolean().optional(),
    title: z.string().nonempty('Title is required.').optional(),
    banner: z.string().nonempty('Banner is required.').optional(),
    des: z.string()
        .max(200, 'Description should not exceed 200 characters.')
        .optional(),
    content: z.string()
        .nonempty('Content is required.')
        .optional(),
    tags: z.array(z.string())
        .min(1, 'At least one tag is required.')
        .max(10, 'Tags should not exceed 10.')
        .optional(),
}).refine(data => {
    if (!data.draft) {
        if (!data.title) return false;
        if (!data.banner) return false;
        if (!data.des) return false;
        if (!data.content) return false;
        if (!data.tags || data.tags.length === 0) return false;
    }
    return true;
}, {
    message: 'Validation failed for non-draft blog.',
    path: ['draft'],
});


export const getBlogQueriesSchema = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    author: z.string().optional(),
    excludedId: z.string().optional(),
    draft: z.enum(['true', 'false']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    skip: z.string().optional(),
}).strict();
export type TGetBlogQueries = z.infer<typeof getBlogQueriesSchema>;







/* ------------- */
export const exampleSchema = z.object({
    user: z.custom<TRegisterUser>(),
    login: z.custom<TLoginUser>(),
    verify: z.custom<TVerifyEmail>(),
    forget: z.custom<TForgetPass>(),
    reset: z.custom<TResetPass>(),
}).strict();


export const userSchema = z.object({
    user_id: z.string().uuid().optional(),

    personal_info: z.object({
        fullname: z.string().min(3, 'fullname must be 3 letters long').toLowerCase(),
        email: z.string().email('Please fill a valid email address').toLowerCase(),
        password: z.string().optional(),
        username: z.string().min(3, 'Username must be 3 letters long').optional(),
        bio: z.string().max(200, 'Bio should not be more than 200').default(""),
        profile_img: z.string().url().optional(),
    }),

    social_links: z.object({
        youtube: z.string().url().optional().default(""),
        instagram: z.string().url().optional().default(""),
        linkedin: z.string().url().optional().default(""),
        twitter: z.string().url().optional().default(""),
        github: z.string().url().optional().default(""),
        website: z.string().url().optional().default(""),
    }),

    account_info: z.object({
        total_posts: z.number().nonnegative().default(0),
        total_reads: z.number().nonnegative().default(0),
    }),

    OAuth: z.boolean().default(false),

    isVerified: z.boolean().default(false),

    resetPassToken: z.string().optional(),
    resetPassExpiresAt: z.date().optional(),

    verificationToken: z.string().length(6).optional(),
    verificationTokenExpiresAt: z.date().optional(),

    blogs: z.array(z.string()).optional(),
}).strict();

export type IUser = z.infer<typeof userSchema>;