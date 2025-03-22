import mongoose from "mongoose";
import { dbUrl } from "../config/index.js";

const dbConfig = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("db connected!");
  } catch (error) {
    console.log(error.message);
  }
};

export default dbConfig;
