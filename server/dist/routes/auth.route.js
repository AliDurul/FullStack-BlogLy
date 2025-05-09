"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_schemas_1 = require("../utils/validation.schemas");
const auth_controller_1 = require("../controllers/auth.controller");
const common_1 = require("../middlewares/common");
const express_1 = require("express");
const router = (0, express_1.Router)();
// URL: /api/v2/auth
router.post('/login', (0, common_1.isValidated)(validation_schemas_1.loginUserSchema), auth_controller_1.login);
router.post('/register', (0, common_1.isValidated)(validation_schemas_1.registerUserSchema), auth_controller_1.register);
router.all('/logout', auth_controller_1.logout);
router.post('/refresh', auth_controller_1.refresh);
router.post('/change-password', auth_controller_1.changePassword);
router.post('/verify-email', (0, common_1.isValidated)(validation_schemas_1.verifyEmailSchema), auth_controller_1.verifyEmail);
router.post('/forget-password', (0, common_1.isValidated)(validation_schemas_1.forgetPassSchema), auth_controller_1.forgetPassword);
router.post('/reset-password/:resetPassToken', (0, common_1.isValidated)(validation_schemas_1.resetPassSchema), auth_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.route.js.map