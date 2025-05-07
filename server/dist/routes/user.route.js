"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const common_1 = require("../middlewares/common");
const validation_schemas_1 = require("../utils/validation.schemas");
const router = (0, express_1.Router)();
// URL: /users
router.route("/")
    .get(user_controller_1.getUsers)
    .put((0, common_1.isValidated)(validation_schemas_1.updateUserSchema), user_controller_1.updateUser);
router.route("/:username").get(user_controller_1.getUserByUsername).delete(user_controller_1.deleteUser);
router.put("/update-profile-img", user_controller_1.updateProfileImg);
exports.default = router;
//# sourceMappingURL=user.route.js.map