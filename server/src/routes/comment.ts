import { Router } from 'express';
import { listReplies, createComment, listRelatedCommets, deleteComment } from '../controllers/comment';

const router = Router();

// URL: /comments

router.route('/').post(createComment);

router.route('/:blog_id').get(listRelatedCommets).delete(deleteComment);

router.route('/replies/:parentId/').get(listReplies);


export default router;