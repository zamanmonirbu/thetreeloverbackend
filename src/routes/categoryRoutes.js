import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";
import { verifyLogin } from "../middlewares/verifyLogin.js";

const router = Router();

router
  .route("/categories")
  .post(verifyLogin, checkAdmin, createCategory)
  .get(getAllCategories);

router
  .route("/categories/:slug")
  .put(verifyLogin, checkAdmin, updateCategory)
  .get(getSpecificCategory)
  .delete(verifyLogin, checkAdmin, deleteCategory);

export default router;
