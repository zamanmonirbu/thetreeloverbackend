import dotenv from "dotenv";
dotenv.config();

const serverPort = process.env.PORT || 5000;
const dbUrl = process.env.MONGODB_URI;

const tokenSecret = process.env.TOKEN_SECRET;
const tokenExpires = process.env.TOKEN_EXPIRES;

const emailAddress = process.env.EMAIL_ADDRESS;
const emailPassword = process.env.EMAIL_SECRET;
const emailHost = process.env.EMAIL_HOST;
const toEmail = "";

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUDE_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinarySecret = process.env.CLOUDINARY_API_SECRET;

export {
  serverPort,
  dbUrl,
  tokenSecret,
  tokenExpires,
  emailAddress,
  emailPassword,
  emailHost,
  toEmail,
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinarySecret,
};
