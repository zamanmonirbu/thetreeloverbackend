import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import userRouter from "./routes/userRoutes.js";
import newsLetterRouter from "./routes/newsLetterRoutes.js";
import statsRouter from "./routes/statRoutes.js";
import contactUsRouter from "./routes/contactUsRoutes.js";

// convert `import.meta.url` to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// root route
app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ status: true, message: "welcome to blog application" });
});

// routes
app.use("/api/v1/", authRouter);
app.use("/api/v1/", blogRouter);
app.use("/api/v1/", categoryRouter);
app.use("/api/v1/", userRouter);
app.use("/api/v1/", newsLetterRouter);
app.use("/api/v1/", statsRouter);
app.use("/api/v1/", contactUsRouter);

export default app;
