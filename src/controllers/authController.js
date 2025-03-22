import User from "../models/userModel.js";

const generateTokens = async (id) => {
  try {
    const user = await User.findById({ _id: id });
    const token = await user.generateToken();
    return token;
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "token generation failed" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    console.log(req.body);
    if (!userFound) {
      return res.status(404).json({ status: false, message: "user not found" });
    }

    const isPasswordCorrect = await userFound.correctPassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ status: false, message: "invalid credentials" });
    }
    const token = await generateTokens(userFound._id);

    const isProduction = process.env.NODE_ENV === "production";

    return res.status(200).json({
      status: true,
      message: "login successful",
      data: { token, userFound },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};


// register user

const registerUser = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ status: false, message: "user already exists" });
    }

    const user = await User.create({ email, fullName, password });
    const token = await generateTokens(user._id);

    return res.status(201).json({
      status: true,
      message: "user created successfully",
      data: { token, user },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

// logout user
const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      status: true,
      message: "logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

const setCookieInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    return res.json({
      status: true,
      data: {
        userId: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
        role: req.user.role,
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



export { loginUser, logoutUser, setCookieInfo ,registerUser};
