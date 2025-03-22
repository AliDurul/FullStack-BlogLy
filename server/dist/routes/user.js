"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
// URL: /users
router.route('/')
    .get(user_1.userList)
    .put(user_1.updateUserProfile);
router.route('/:username')
    .get(user_1.userRead)
    .delete(user_1.userDelete);
router.post('/change-password', user_1.changePassword);
router.put('/update-profile-img', user_1.updateProfileImg);
exports.default = router;
//# sourceMappingURL=user.js.map