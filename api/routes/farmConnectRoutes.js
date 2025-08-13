const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  likePost,
  createStory,
  getStories,
  likeStory,
  addComment,
  sharePost,
  getFarmerProfile
} = require('../controllers/farmConnectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');

// Posts routes
router.route('/posts')
  .get(getPosts)
  .post(protect, upload.array('images', 5), createPost);

router.route('/posts/:id/like')
  .post(protect, likePost);

router.route('/posts/:id/comments')
  .post(protect, addComment);

router.route('/posts/:id/share')
  .post(protect, sharePost);

// Stories routes
router.route('/stories')
  .get(getStories)
  .post(protect, upload.single('image'), createStory);

router.route('/stories/:id/like')
  .post(protect, likeStory);

// Farmer profile
router.route('/farmers/:id')
  .get(getFarmerProfile);

module.exports = router;
