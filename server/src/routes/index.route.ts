import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";

const router = Router();

// authRoutes
router.use('/auth', authRoutes);

// userRoutes
router.use("/users", userRoutes);

export default router;