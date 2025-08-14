// Your existing route structure in the main route file is correct:

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
  getFarmerProfile,        // ✅ Already imported
  updateFarmerProfile,     // ✅ Already imported
  uploadFarmerPhotos       // ✅ Already imported
} = require("../controllers/farmConnectController");

const { verifyToken, isFarmer } = require("../middleware/authMiddleware");

// ===== Posts routes =====
router.post("/posts", verifyToken, isFarmer, createPost);
router.get("/posts", getPosts);
router.post("/posts/:id/like", verifyToken, likePost);
router.post("/posts/:id/comments", verifyToken, addComment);
router.post("/posts/:id/share", verifyToken, sharePost);

// ===== Stories routes =====
router.post("/stories", verifyToken, isFarmer, createStory);
router.get("/stories", getStories);
router.post("/stories/:id/like", verifyToken, likeStory);

// ===== Farmer profile routes =====
router.get("/farmers/:id", getFarmerProfile);                              // ✅ Get farmer profile (Public)
router.put("/farmers/:id", verifyToken, updateFarmerProfile);             // ✅ Update farmer profile (Private)
router.post("/farmers/:id/photos", verifyToken, uploadFarmerPhotos);      // ✅ Upload photos (Private)

module.exports = router;

// Notes:
// 1. The routes are correctly set up
// 2. GET /farmers/:id is public (anyone can view farmer profiles)
// 3. PUT /farmers/:id requires authentication (only authenticated users can update)
// 4. POST /farmers/:id/photos requires authentication (only authenticated users can upload photos)
// 5. Additional role-based authorization is handled inside the controller functions
