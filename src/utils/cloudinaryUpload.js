import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  cloudinaryApiKey,
  cloudinaryCloudName,
  cloudinarySecret,
} from "../config/index.js";

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinarySecret,
});

const cloudinaryUpload = async (filePath, public_id, folder) => {
  let uploadImage;

  try {
    uploadImage = await cloudinary.uploader.upload(filePath, {
      public_id,
      folder,
    });

    fs.unlinkSync(filePath);
  } catch (error) {
    fs.unlinkSync(filePath);
    return "file upload failed";
  }
  return uploadImage;
};

export { cloudinaryUpload };
