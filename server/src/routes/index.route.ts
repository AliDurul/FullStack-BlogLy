import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import blogRoutes from "./blog.route";
import commentRoutes from "./comment.route";
import notificationRoutes from "./notification.route";

const router = Router();

// authRoutes
router.use('/auth', authRoutes);

// userRoutes
router.use("/users", userRoutes);

// blogRoutes
router.use("/blogs", blogRoutes);

// commentRoutes
router.use("/comments", commentRoutes);

// notificationRoutes
router.use("/comments", notificationRoutes);

export default router;