import { forgetPassSchema, loginUserSchema, registerUserSchema, resetPassSchema, verifyEmailSchema } from '../utils/validation.schemas';
import { changePassword, forgetPassword, login, logout, refresh, register, resetPassword, verifyEmail } from '../controllers/auth.controller';
import { isValidated } from '../middlewares/common';
import { Router } from 'express';

const router = Router();

// URL: /api/v2/auth

router.post('/login', isValidated(loginUserSchema), login);
router.post('/register', isValidated(registerUserSchema), register);
router.all('/logout', logout);
router.post('/refresh', refresh);

router.post('/change-password', changePassword);
router.post('/verify-email', isValidated(verifyEmailSchema), verifyEmail);
router.post('/forget-password', isValidated(forgetPassSchema), forgetPassword);
router.post('/reset-password/:resetPassToken', isValidated(resetPassSchema), resetPassword);


export default router;