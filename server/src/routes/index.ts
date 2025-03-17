import { Router } from 'express';

import documentRoutes from './document';

const router = Router();
/* ------------------------------------------------------- */

// document:
router.use('/documents', documentRoutes);



/* ------------------------------------------------------- */
export default router;