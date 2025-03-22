import Category from "../models/categoryModel.js";

// @desc:  create category
// @route: POST /api/v1/categories/
const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const randomSlug = `${title}-${
      Date.now() - Math.round(Math.random() * 900000 + 1)
    }`;

    const categoryFound = await Category.findOne({ title });
    if (categoryFound) {
      return res
        .status(400)
        .json({ status: false, message: "category already exist" });
    }

    const category = await Category.create({ title, slug: randomSlug });

    return res.status(201).json({
      status: true,
      message: "category created successfully",
      data: category,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  update category
// @route: PUT /api/v1/categories/
const updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title } = req.body;

    const categoryFound = await Category.findOne({ slug });
    if (!categoryFound) {
      return res
        .status(400)
        .json({ status: false, message: "category not found" });
    }

    const category = await Category.findOneAndUpdate(
      { slug },
      {
        title: title || categoryFound.title,
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get all categories
// @route: GET /api/v1/categories/
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({
      status: true,
      message: "fetch all categories successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get specific category
// @route: GET /api/v1/categories/:slug
const getSpecificCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res
        .status(400)
        .json({ status: false, message: "category not found" });
    }

    return res.status(200).json({
      status: true,
      message: "category fetch successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  delete specific category
// @route: DELETE /api/v1/categories/:slug
const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res
        .status(400)
        .json({ status: false, message: "category not found" });
    }

    await Category.findOneAndDelete(category);

    return res.status(200).json({
      status: true,
      message: "category deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

export {
  createCategory,
  updateCategory,
  getAllCategories,
  getSpecificCategory,
  deleteCategory,
};
