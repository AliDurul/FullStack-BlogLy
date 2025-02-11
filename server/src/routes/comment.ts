import { Router } from 'express';
import { listReplies } from '../controllers/comment';

const router = Router();

const { create, list} = require('../controllers/comment');

// URL: /comments

router.route('/').post(create);

router.route('/:blog_id').get(list);

router.route('/replies/:parentId/').get(listReplies);



export default router;