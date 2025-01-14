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
    data: z.object({
      text: z.string().min(1, "Content is required"),
      url: z.string().optional(),
      caption: z.string().optional(),
      children: z.array(z.object({
        text: z.string().optional(),
        url: z.string().optional(),
        caption: z.string().optional(),
      })).optional()
    })
  }))
});

export const blogDraftSchema = z.object({
  title: z.string().min(1, "Title is required."),
  draft: z.boolean().optional(),
})

export type TBlogPublishSchema = z.infer<typeof blogPublishSchema>; 