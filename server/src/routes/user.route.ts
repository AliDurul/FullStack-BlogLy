import { Router } from "express";
import { deleteUser, getUserByUsername, getUsers, updateProfileImg, updateUser } from "../controllers/user.controller";
import { isValidated } from "../middlewares/common";
import { updateUserSchema } from "../utils/validation.schemas";

const router = Router();

// URL: /users

router.route("/")
    .get(getUsers)
    .put(updateUser);

router.route("/:username").get(getUserByUsername).delete(deleteUser);

router.put("/update-profile-img", updateProfileImg);

export default router;