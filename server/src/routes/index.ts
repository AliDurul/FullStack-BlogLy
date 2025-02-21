"use strict";

import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import uploadRoutes from './upload';
import blogRoutes from './blog';
import documentRoutes from './document';
import commentRoutes from './comment';
import notificationRoutes from './notification';

const router = Router();
/* ------------------------------------------------------- */

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/upload-url', uploadRoutes);

// document:
router.use('/documents', documentRoutes);



/* ------------------------------------------------------- */
export default router;