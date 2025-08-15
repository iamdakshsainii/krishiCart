const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  deletePost,          // ✅ Add this import
  likePost,
  addComment,
  sharePost,
  createStory,
  getStories,
  deleteStory,         // ✅ Add this import
  likeStory,
  getFarmerProfile,
  updateFarmerProfile,
  uploadFarmerPhotos
} = require("../controllers/farmConnectController");

const { verifyToken, isFarmer } = require("../middleware/authMiddleware");

// ===== Posts routes =====
router.post("/posts", verifyToken, isFarmer, createPost);
router.get("/posts", getPosts);
router.delete("/posts/:id", verifyToken, deletePost);        // ✅ Add this route
router.post("/posts/:id/like", verifyToken, likePost);
router.post("/posts/:id/comments", verifyToken, addComment);
router.post("/posts/:id/share", verifyToken, sharePost);

// ===== Stories routes =====
router.post("/stories", verifyToken, isFarmer, createStory);
router.get("/stories", getStories);
router.delete("/stories/:id", verifyToken, deleteStory);     // ✅ Add this route
router.post("/stories/:id/like", verifyToken, likeStory);

// ===== Farmer profile routes =====
router.get("/farmers/:id", getFarmerProfile);
router.put("/farmers/:id", verifyToken, updateFarmerProfile);
router.post("/farmers/:id/photos", verifyToken, uploadFarmerPhotos);

module.exports = router;
