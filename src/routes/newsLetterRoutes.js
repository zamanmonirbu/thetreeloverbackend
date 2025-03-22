import { Router } from "express";
import {
  getAllSubscribedUsers,
  joinNewsletter,
  sendNewsLetter,
} from "../controllers/newsLetterController.js";

const router = Router();

router.route("/newsletters").post(joinNewsletter);

router.route("/newsletters").get(getAllSubscribedUsers);

router.route("/newsletters/send").post(sendNewsLetter);

export default router;
