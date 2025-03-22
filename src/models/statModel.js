import mongoose, { Schema } from "mongoose";

const statModel = new Schema(
  {
    totalViews: {
      type: Number,
      default: 0,
    },
    totalCategory: {
      type: Number,
      default: 0,
    },
    totalBlogs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Stats = mongoose.model("Stats", statModel);

export default Stats;
