// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

// Middleware to protect routes
exports.verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      return next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Role-based middlewares
exports.isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  throw new Error("Not authorized as an admin");
});

exports.isFarmer = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "farmer") {
    return next();
  }
  res.status(403);
  throw new Error("Not authorized as a farmer");
});

exports.isConsumer = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "consumer") {
    return next();
  }
  res.status(403);
  throw new Error("Not authorized as a consumer");
});
