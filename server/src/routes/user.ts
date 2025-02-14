import { Router } from 'express';
import { changePassword } from '../controllers/user';

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

router.post('/change-password', changePassword)


export default router;