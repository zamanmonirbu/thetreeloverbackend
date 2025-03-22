import { Router } from "express";
import {
  blogStats,
  getBlogsCountByMonth,
} from "../controllers/statController.js";

const router = Router();

router.route("/stats").get(blogStats);
router.route("/stats/blogs-by-month").get(getBlogsCountByMonth);

export default router;
