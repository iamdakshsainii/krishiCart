const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

// Create post
router.post("/", protect, postController.createPost);

// Get all posts
router.get("/", postController.getPosts);

// Like/Unlike a post
router.put("/:id/like", protect, postController.likePost);

module.exports = router;
