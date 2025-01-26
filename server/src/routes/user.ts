import { Router } from 'express';

const router = Router();

const { list, read, update, deletee } = require('../controllers/user');

// URL: /users

router.route('/')
    .get(list)

router.route('/:username')
    .get(read)
    .put(update)
    .patch(update)
    .delete(deletee)


export default router;