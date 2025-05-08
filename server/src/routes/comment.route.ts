import { Router } from 'express';
import { listReplies, createComment, listRelatedComments, deleteComment } from '../controllers/comment.controller';

const router = Router();

// URL: /comments

router.route('/').post(createComment);

router.route('/:blog_id').get(listRelatedComments).delete(deleteComment);

router.route('/replies/:parentId/').get(listReplies);


export default router;