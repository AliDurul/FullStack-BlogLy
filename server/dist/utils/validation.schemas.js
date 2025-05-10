"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.exampleSchema = exports.getBlogQueriesSchema = exports.createBlogSchema = exports.updateUserSchema = exports.resetPassSchema = exports.forgetPassSchema = exports.verifyEmailSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    fullname: zod_1.z.string().min(1, 'Fullname is required').max(50, 'Fullname must be less than 50 characters'),
    email: zod_1.z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
    password: zod_1.z.string().optional().refine(password => {
        if (password && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) {
            return false;
        }
        return true;
    }, {
        message: 'Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.',
        path: ['password'],
    }),
    sub: zod_1.z.string().optional(),
    picture: zod_1.z.string().url('Picture must be a valid URL').optional(),
    github_link: zod_1.z.string().url('Github link must be a valid URL').optional(),
    bio: zod_1.z.string().max(200, 'Bio should not be more than 200').optional(),
}).refine(data => {
    if (data.sub) {
        if (!data.picture) {
            return false;
        }
    }
    else {
        if (!data.password) {
            return false;
        }
    }
    return true;
}, {
    message: 'Password is required if sub is not provided, and picture is required if sub is provided.',
    path: ['sub'],
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters'),
}).strict();
exports.verifyEmailSchema = zod_1.z.object({
    verificationToken: zod_1.z.string().length(6, 'Verification token must be 6 digits long')
}).strict();
exports.forgetPassSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
}).strict();
exports.resetPassSchema = zod_1.z.object({
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long').max(16, 'Password must be less than 16 characters')
}).strict();
exports.updateUserSchema = zod_1.z.object({
    personal_info: zod_1.z.object({
        fullname: zod_1.z.string().min(3, 'fullname must be 3 letters long').toLowerCase(),
        email: zod_1.z.string().email('Please fill a valid email address').toLowerCase(),
        bio: zod_1.z.string().max(200, 'Bio should not be more than 200'),
    }),
    social_links: zod_1.z.object({
        youtube: zod_1.z.string().url().optional(),
        instagram: zod_1.z.string().url().optional(),
        linkedin: zod_1.z.string().url().optional(),
        twitter: zod_1.z.string().url().optional(),
        github: zod_1.z.string().url().optional(),
        website: zod_1.z.string().url().optional(),
    }),
}).strict();
exports.createBlogSchema = zod_1.z.object({
    draft: zod_1.z.boolean().optional(),
    title: zod_1.z.string().nonempty('Title is required.').optional(),
    banner: zod_1.z.string().nonempty('Banner is required.').optional(),
    des: zod_1.z.string()
        .max(200, 'Description should not exceed 200 characters.')
        .optional(),
    content: zod_1.z.array(zod_1.z.any())
        .nonempty('Content is required.')
        .optional(),
    tags: zod_1.z.array(zod_1.z.string())
        .min(1, 'At least one tag is required.')
        .max(10, 'Tags should not exceed 10.')
        .optional(),
}).refine(data => {
    if (!data.draft) {
        if (!data.title)
            return false;
        if (!data.banner)
            return false;
        if (!data.des)
            return false;
        if (!data.content)
            return false;
        if (!data.tags || data.tags.length === 0)
            return false;
    }
    return true;
}, {
    message: 'Validation failed for non-draft blog.',
    path: ['draft'],
});
exports.getBlogQueriesSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    excludedId: zod_1.z.string().optional(),
    draft: zod_1.z.enum(['true', 'false']).optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    skip: zod_1.z.string().optional(),
}).strict();
/* ------------- */
exports.exampleSchema = zod_1.z.object({
    user: zod_1.z.custom(),
    login: zod_1.z.custom(),
    verify: zod_1.z.custom(),
    forget: zod_1.z.custom(),
    reset: zod_1.z.custom(),
}).strict();
exports.userSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid().optional(),
    personal_info: zod_1.z.object({
        fullname: zod_1.z.string().min(3, 'fullname must be 3 letters long').toLowerCase(),
        email: zod_1.z.string().email('Please fill a valid email address').toLowerCase(),
        password: zod_1.z.string().optional(),
        username: zod_1.z.string().min(3, 'Username must be 3 letters long').optional(),
        bio: zod_1.z.string().max(200, 'Bio should not be more than 200').default(""),
        profile_img: zod_1.z.string().url().optional(),
    }),
    social_links: zod_1.z.object({
        youtube: zod_1.z.string().url().optional().default(""),
        instagram: zod_1.z.string().url().optional().default(""),
        linkedin: zod_1.z.string().url().optional().default(""),
        twitter: zod_1.z.string().url().optional().default(""),
        github: zod_1.z.string().url().optional().default(""),
        website: zod_1.z.string().url().optional().default(""),
    }),
    account_info: zod_1.z.object({
        total_posts: zod_1.z.number().nonnegative().default(0),
        total_reads: zod_1.z.number().nonnegative().default(0),
    }),
    OAuth: zod_1.z.boolean().default(false),
    isVerified: zod_1.z.boolean().default(false),
    resetPassToken: zod_1.z.string().optional(),
    resetPassExpiresAt: zod_1.z.date().optional(),
    verificationToken: zod_1.z.string().length(6).optional(),
    verificationTokenExpiresAt: zod_1.z.date().optional(),
    blogs: zod_1.z.array(zod_1.z.string()).optional(),
}).strict();
//# sourceMappingURL=validation.schemas.js.map