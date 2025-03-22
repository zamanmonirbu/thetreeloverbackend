import { Router } from "express";
import {
  loginUser,
  logoutUser,
  setCookieInfo,
  registerUser
} from "../controllers/authController.js";

const router = Router();

router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);

router.route("/auth/me").get(setCookieInfo);

router.route("/auth/logout").post(logoutUser);

export default router;
