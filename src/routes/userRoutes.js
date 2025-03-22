import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateAvatar,
  updateUserInfo,
} from "../controllers/userController.js";
import upload from "../middlewares/multer.js";
import { verifyLogin } from "../middlewares/verifyLogin.js";

const router = Router();

router.route("/users").post(createUser).get(getAllUsers);

router
  .route("/users/upload-avatar")
  .patch(verifyLogin, upload.single("profileImage"), updateAvatar);

router
  .route("/users/:id")
  .put(verifyLogin, updateUserInfo)
  .get(getSingleUser)
  .delete(deleteUser);

export default router;
