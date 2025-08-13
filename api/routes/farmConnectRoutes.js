// routes/farmConnectRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  likePost,
  addComment,
  sharePost,
  createStory,
  getStories,
  likeStory,
  getFarmerProfile
} = require("../controllers/farmConnectController");
const { verifyToken, isFarmer } = require("../middleware/authMiddleware");

// Posts routes
router.post("/posts", verifyToken, isFarmer, createPost);
router.get("/posts", getPosts);
router.post("/posts/:id/like", verifyToken, likePost);
router.post("/posts/:id/comments", verifyToken, addComment);
router.post("/posts/:id/share", verifyToken, sharePost);

// Stories routes
router.post("/stories", verifyToken, isFarmer, createStory);
router.get("/stories", getStories);
router.post("/stories/:id/like", verifyToken, likeStory);

// Farmer profile
router.get("/farmers/:id", getFarmerProfile);

module.exports = router;
