import fs from "fs";
import cloudinary from "cloudinary";
import path from "path";
import Blog from "../models/blogModel.js";
import Category from "../models/categoryModel.js";
import { fileURLToPath } from "url";
import Stats from "../models/statModel.js";
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc  create blog
// @route POST /api/v1/blogs
const createBlog = async (req, res) => {
  try {
    const { title, description, category, authorName, referenceUrl, date } =
      req.body;

    const referenceUrls =
      typeof referenceUrl === "string"
        ? referenceUrl.split(",").map((url) => url.trim())
        : [];

    let slug;
    let isUnique = false;

    while (!isUnique) {
      const timestamp = Date.now();
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      slug = `${title
        .toLowerCase()
        .replace(/[?&=]/g, "")
        .replace(/\s+/g, "-")}-${timestamp}-${randomNum}`;

      const existingBlog = await Blog.findOne({ slug });
      if (!existingBlog) {
        isUnique = true;
      }
    }

    // let imgUrl = await cloudinaryUpload(req.file.path, title, "blogs");
    const sanitizedTitle = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[?&=]/g, "");

    let imgUrl = await cloudinaryUpload(req.file.path, sanitizedTitle, "blogs");

    const blog = await Blog.create({
      title,
      description,
      category,
      authorName,
      referenceUrl: referenceUrls,
      date,
      slug,
      image: imgUrl.url,
    });
    return res
      .status(201)
      .json({ status: true, message: "new blog created", data: blog });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc  get all blogs
// @route GET /api/v1/blogs
const getAllBlogs = async (req, res) => {
  try {
    let { page, limit, category, search, publish } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 15;
    const skip = (page - 1) * limit;

    let filter = {};

    if (category) {
      const categoryFound = await Category.findOne({ title: category });
      if (!categoryFound) {
        return res.status(404).json({
          status: false,
          message: "category not found",
        });
      }
      filter.category = categoryFound._id;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (publish !== undefined) {
      filter.isPublished = publish == "true" ? true : false;
    }

    const totalBlogs = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
      .populate("category", "-createdAt -updatedAt -__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: true,
      message: "fetched all blogs successfully",
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
        hasNextPage: page * limit < totalBlogs,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc  get a specific blog
// @route GET /api/v1/blogs/:slug
const getSingleBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug })
      .populate("category", "-createdAt -updatedAt -__v")
      .select("-__v");

    if (!blog) {
      return res
        .status(404)
        .json({ status: false, message: "blog not found", data: null });
    }

    // increment the view count
    blog.views += 1;
    await blog.save();

    return res.status(200).json({
      status: true,
      message: "fetch blog successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc  update a blog
// @route PUT /api/v1/blogs/:slug
const updateBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    const { title, description, category, authorName, referenceUrl, date } =
      req.body;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "blog not found",
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (authorName) updateData.authorName = authorName;
    if (date) updateData.date = date;

    if (referenceUrl) {
      updateData.referenceUrl =
        typeof referenceUrl === "string"
          ? referenceUrl.split(",").map((url) => url.trim())
          : blog.referenceUrl;
    }

    if (req.file) {
      if (blog.image) {
        try {
          const oldImageUrl = blog.image;
          const parts = oldImageUrl.split("/");
          const filenameWithExt = parts.pop();
          const folder = parts.pop();
          const oldPublicId = `${folder}/${filenameWithExt.split(".")[0]}`;
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (err) {}
      }

      const sanitizedTitle = (title || blog.title)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[?&=]/g, "");

      const imgUrl = await cloudinaryUpload(
        req.file.path,
        sanitizedTitle,
        "blogs"
      );

      if (imgUrl && imgUrl.url) {
        updateData.image = imgUrl.url;
      } else {
        return res.status(500).json({
          status: false,
          message: "failed to upload image",
        });
      }
    }

    const updatedBlog = await Blog.findOneAndUpdate({ slug }, updateData, {
      new: true,
    });

    return res.status(200).json({
      status: true,
      message: "blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// @desc  get blog by date
// @route GET /api/v1/blogs/latest
const getLatestBlogs = async (req, res) => {
  try {
    const currentDate = new Date();

    const last7DaysDate = new Date();
    last7DaysDate.setDate(currentDate.getDate() - 7);
    last7DaysDate.setUTCHours(0, 0, 0, 0);

    const blogs = await Blog.find({
      date: { $gte: last7DaysDate },
    })
      .sort({ views: -1 })
      .limit(6);

    return res.status(200).json({
      status: true,
      message: "fetched blogs from the last 7 days successfully",
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// @desc  delete a blog
// @route DELETE /api/v1/blogs/:slug
const deleteBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the blog
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "blog not found",
      });
    }

    if (blog.image) {
      try {
        const oldImageUrl = blog.image;
        const parts = oldImageUrl.split("/");
        const filenameWithExt = parts.pop();
        const folder = parts.pop();
        const oldPublicId = `${folder}/${filenameWithExt.split(".")[0]}`;
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (err) {
        return res
          .status(400)
          .json({ status: false, message: "image deltetion failed" });
      }
    }

    const blogViews = blog.views;

    await Blog.deleteOne({ slug });

    const stats = await Stats.findOneAndUpdate(
      {},
      {
        $inc: { totalBlogs: -1, totalViews: -blogViews },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      status: true,
      message: "blog deleted successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({
      status: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// @desc  publish a blog
// @route POST /api/v1/blogs/:slug
const publishBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    blog.isPublished = true;
    await blog.save();

    return res.status(200).json({
      status: true,
      message: "blog published successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// @desc  publish a blog
// @route POST /api/v1/blogs/unpublish/:slug
const unPublishBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    blog.isPublished = false;
    await blog.save();

    return res.status(200).json({
      status: true,
      message: "blog unpublished successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

export {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  getLatestBlogs,
  unPublishBlog,
};
