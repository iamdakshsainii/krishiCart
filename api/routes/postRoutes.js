const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload'); // if using file uploads

router.route('/')
  .get(postController.getPosts)
  .post(protect, upload.array('images', 5), postController.createPost);

router.route('/:id/like').put(protect, postController.likePost);

module.exports = router;
