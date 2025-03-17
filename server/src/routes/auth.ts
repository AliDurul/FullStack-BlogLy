import { Router } from "express";
import { login, logout, refresh, register } from "../controllers/auth";

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;