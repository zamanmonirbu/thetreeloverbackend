import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc:  create user
// @route: POST /api/v1/users/
const createUser = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({
        status: false,
        message: "user already exist",
        data: null,
      });
    }

    const user = await User.create({ email, fullName, password });
    return res
      .status(201)
      .json({ status: true, message: "user created successfully", data: user });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  update avatar of an user
// @route: PATCH /api/v1/users/upload-avatar
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "no image uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: false, message: "user not found" });
    }

    if (user.profileImage && fs.existsSync(user.profileImage)) {
      fs.unlinkSync(user.profileImage);
    }

    let imgUrl = req.file ? `/uploads/${req.file.filename}` : "";
    user.profileImage = imgUrl;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "avatar uploaded successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  update user info
// @route: PATCH /api/v1/users/:id
const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password } = req.body;

    const userFound = await User.findById(id);
    if (!userFound) {
      return res.status(404).json({ status: false, message: "user not found" });
    }

    const updatedInfo = {
      fullName: fullName || userFound.fullName,
      email: email || userFound.email,
    };

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatedInfo.password = hashedPassword;
    } else {
      updatedInfo.password = userFound.password;
    }

    const user = await User.findByIdAndUpdate(id, updatedInfo, { new: true });
    return res.status(200).json({
      status: true,
      message: "user information updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get all users
// @route: GET /api/v1/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      status: true,
      message: "all users fetched successful",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get all users
// @route: GET /api/v1/users
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userFound = await User.findById(id);
    if (!userFound) {
      return res.status(404).json({ status: false, message: "user not found" });
    }
    return res.status(200).json({
      status: true,
      message: "single user fetched successful",
      data: userFound,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  delete a single user
// @route: DELETE /api/v1/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: false, message: "user not found" });
    }
    await User.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: true, message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

export {
  createUser,
  updateAvatar,
  updateUserInfo,
  getAllUsers,
  getSingleUser,
  deleteUser,
};
