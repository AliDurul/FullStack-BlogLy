import { Router } from 'express';
import { changePassword, updateProfileImg, userDelete, userList, userRead } from '../controllers/user';

const router = Router();


// URL: /users

router.route('/')
    .get(userList)

router.route('/:username')
    .get(userRead)
    .delete(userDelete)

router.post('/change-password', changePassword)
router.put('/update-profile-img', updateProfileImg)


export default router;