import { Router } from 'express';

import { isExistNotification, listNotifications } from '../controllers/notification';

const router = Router();

// URL: /notifications

router.get('/', listNotifications);
router.get('/new', isExistNotification);

export default router;