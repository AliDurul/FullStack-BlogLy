import { Router } from 'express';

const router = Router();

const { create, list} = require('../controllers/comment');

// URL: /comments

router.route('/').post(create);

router.route('/:blog_id').get(list);



export default router;