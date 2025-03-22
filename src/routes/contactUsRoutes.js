import { Router } from "express";
import {
  deleteContact,
  getAllContacts,
  getContactById,
  sendContactMessage,
} from "../controllers/contatUsController.js";

const router = Router();

router.route("/contact").post(sendContactMessage).get(getAllContacts);

router.route("/contact/:id").get(getContactById).delete(deleteContact);

export default router;
