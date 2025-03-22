import Blog from "../models/blogModel.js";
import Stats from "../models/statModel.js";
import Category from "../models/categoryModel.js";

// @desc:  get all blogs count
// @route: GET /api/v1/stats
const blogStats = async (req, res) => {
  try {
    const totalViewsResult = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const totalViews =
      totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;

    const totalCategory = await Category.countDocuments();

    const totalBlogs = await Blog.countDocuments();

    const stats = await Stats.findOneAndUpdate(
      {},
      { totalViews, totalCategory, totalBlogs },
      { new: true, upsert: true }
    ).select("-createdAt -__v -updatedAt");

    return res.status(200).json({
      success: true,
      message: "blogs stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get blogs count by month
// @route: GET /api/v1/stats/blogs-by-month
const getBlogsCountByMonth = async (req, res) => {
  try {
    const blogs = await Blog.find({}, "createdAt");

    if (!blogs || blogs.length === 0) {
      return res.status(200).json({
        status: true,
        message: "no blogs found",
      });
    }

    const monthlyCounts = {};

    blogs.forEach((blog) => {
      const date = new Date(blog.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const key = `${year}-${month < 10 ? "0" + month : month}`;

      if (!monthlyCounts[key]) {
        monthlyCounts[key] = 0;
      }
      monthlyCounts[key] += 1;
    });

    return res.status(200).json({
      status: true,
      message: "monthly blog count fetched successfully",
      data: monthlyCounts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

export { blogStats, getBlogsCountByMonth };
