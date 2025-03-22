"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.post('/login', auth_1.login);
router.post('/register', auth_1.register);
router.post('/refresh', auth_1.refresh);
router.post('/logout', auth_1.logout);
exports.default = router;
//# sourceMappingURL=auth.js.map