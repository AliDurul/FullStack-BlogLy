import { Router } from 'express';

import documentRoutes from './document';
import authRoutes from './auth';
import userRoutes from './user';
import blogRoutes from './blog';
import commentRoutes from './comment';
import notificationRoutes from './notification';
import uploadRoutes from './upload';

const router = Router();
/* ------------------------------------------------------- */

// auth
router.use('/auth', authRoutes);
// users
router.use('/users', userRoutes);
// blogs
router.use('/blogs', blogRoutes);
// comments
router.use('/comments', commentRoutes);
// notifications
router.use('/notifications', notificationRoutes);
// comments
router.use('/upload-url', uploadRoutes);
// document:
router.use('/documents', documentRoutes);


/* ------------------------------------------------------- */
export default router;