import { Router } from 'express';

const router = Router();

const { create } = require('../controllers/comment');

// URL: /comments

router.route('/').post(create);


export default router;