import { Router } from 'express';
import { isExistNotification, listNotifications } from '../controllers/notification.controller';

const router = Router();

// Base URL: /notifications

router.get('/', listNotifications);
router.get('/new', isExistNotification);

export default router;