import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getLatestBlogs,
  getSingleBlog,
  publishBlog,
  unPublishBlog,
  updateBlog,
} from "../controllers/blogController.js";
import upload from "../middlewares/multer.js";
import { verifyLogin } from "../middlewares/verifyLogin.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";

const router = Router();

router
  .route("/blogs")
  .post(verifyLogin, checkAdmin, upload.single("image"), createBlog)
  .get(getAllBlogs);

router.route("/blogs/latest").get(getLatestBlogs);

router.route("/blogs/unpublish/:slug").post(unPublishBlog);

router
  .route("/blogs/:slug")
  .get(getSingleBlog)
  .post(publishBlog)
  .put(verifyLogin, checkAdmin, upload.single("image"), updateBlog)
  .delete(verifyLogin, checkAdmin, deleteBlog);

export default router;
