import { Router } from 'express';

import documentRoutes from './document';
import authRoutes from './auth';
import userRoutes from './user';

const router = Router();
/* ------------------------------------------------------- */


router.use('/auth', authRoutes);

router.use('/users', userRoutes);

// document:
router.use('/documents', documentRoutes);



/* ------------------------------------------------------- */
export default router;