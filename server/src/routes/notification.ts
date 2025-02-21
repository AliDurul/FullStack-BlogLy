import { Router } from 'express';

import { listNotification } from '../controllers/notification';

const router = Router();

// URL: /notifications
router.get('/new', listNotification);

export default router;