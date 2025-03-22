import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { tokenExpires, tokenSecret } from "../config/index.js";


console.log(tokenExpires, tokenSecret , "tokenExpires, tokenSecret");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  profileImage: {
    type: String,
  },
});

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// check password is correct or not
userSchema.methods.correctPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// generate jwt token
userSchema.methods.generateToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
    },
    tokenSecret,
    { expiresIn: 24 * 60 * 60 }
  );
};

// jwt token verification
userSchema.methods.verifyToken = async function (token) {
  return jwt.verify(token, accessTokenSecret, function (err, decoded) {
    if (err) {
      return null;
    }
    return decoded;
  });
};

const User = mongoose.model("User", userSchema);

export default User;
