"use strict";

import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import uploadRoutes from './upload';

const router = Router();
/* ------------------------------------------------------- */

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/upload-url', uploadRoutes);

// document:
// router.use('/documents', documentRoutes);

/* ------------------------------------------------------- */
export default router;