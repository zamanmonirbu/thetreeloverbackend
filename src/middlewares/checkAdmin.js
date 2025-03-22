const checkAdmin = (req, res, next) => {
  console.log("passing through checkAdmin middleware");
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ status: false, message: "access denied" });
  }
  next();
};

export { checkAdmin };
