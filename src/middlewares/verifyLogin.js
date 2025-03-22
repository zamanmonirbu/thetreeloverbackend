import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { tokenSecret } from "../config/index.js";

const verifyLogin = async (req, res, next) => {
  try {
    // console.log("passing through verifyLogin middleware",req.header("Authorization"));
    const token = req.header("Authorization")?.replace("Bearer ", "");

    console.log(token, "token");

    // verify the token
    const decodedToken = jwt.verify(token, tokenSecret, (err, decoded) => {
      if (err) {
        return null;
      }
      return decoded;
    });
    console.log(decodedToken, "decodedToken");
    if (!decodedToken) {
      return res.status(401).json({ status: false, message: "invalid token" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "unauthorized access" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

export { verifyLogin };
