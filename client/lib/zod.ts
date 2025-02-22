import { z } from 'zod';

export const credentialsSchema = z.object({
  fullname: z.string().min(3, "Full name is required").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be no more than 20 characters long")
    .refine((val) => /[A-Z]/.test(val), "Password must include at least one uppercase letter")
    .refine((val) => /[a-z]/.test(val), "Password must include at least one lowercase letter")
    .refine((val) => /\d/.test(val), "Password must include at least one number")
});

export const blogPublishSchema = z.object({
  draft: z.boolean().optional(),
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  des: z.string()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters"),
  banner: z.string().min(1, "Banner image is required"),
  tags: z.array(z.string())
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed"),
  content: z.array(z.object({
    id: z.string(),
    type: z.string(),
    data: z.any()
  }))
});

export type TBlogPublishSchema = z.infer<typeof blogPublishSchema>;


export const blogDraftSchema = z.object({
  title: z.string().min(1, "Title is required."),
  draft: z.boolean().optional(),
})

export const commentSchema = z.object({
  comment: z.string().min(1, "Comment is required."),
  _id: z.string().min(1, "Blog id is not captured."),
  blog_author: z.string().min(1, "Blog author id is not captured."),
  replying_to: z.string().nullable().optional(),
  notification_id: z.string().nullable().optional()
})

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(6, "Old password must be at least 6 characters long")
    .max(20, "Old password must be no more than 20 characters long"),
  newPassword: z.string()
    .min(6, "New password must be at least 6 characters long")
    .max(20, "New password must be no more than 20 characters long")
    .refine((val) => /[A-Z]/.test(val), "New password must include at least one uppercase letter")
    .refine((val) => /[a-z]/.test(val), "New password must include at least one lowercase letter")
    .refine((val) => /\d/.test(val), "New password must include at least one number")
});

export type TChangePassword = z.infer<typeof changePasswordSchema>;


export const userProfileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  bio: z.string().max(150, "Bio must be less than 150 characters").optional(),
  social_links: z.object({
    youtube: z.string().url("Invalid URL").or(z.literal("")),
    facebook: z.string().url("Invalid URL").or(z.literal("")),
    twitter: z.string().url("Invalid URL").or(z.literal("")),
    github: z.string().url("Invalid URL").or(z.literal("")),
    instagram: z.string().url("Invalid URL").or(z.literal("")),
    website: z.string().url("Invalid URL").or(z.literal(""))
  })
});

export type TUserProfile = z.infer<typeof userProfileSchema>;