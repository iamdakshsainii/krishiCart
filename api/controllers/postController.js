// const Post = require('../models/Post');
// const asyncHandler = require('express-async-handler');

// // @desc    Create a new post
// // @route   POST /api/posts
// // @access  Private
// const createPost = asyncHandler(async (req, res) => {
//   const { content } = req.body;

//   const post = await Post.create({
//     user: req.user._id,
//     content,
//     images: req.files?.map(file => file.path) // if using file upload
//   });

//   res.status(201).json(post);
// });

// // @desc    Get all posts
// // @route   GET /api/posts
// // @access  Public
// const getPosts = asyncHandler(async (req, res) => {
//   const posts = await Post.find().populate('user', 'name avatar').sort('-createdAt');
//   res.json(posts);
// });

// // @desc    Like/unlike a post
// // @route   PUT /api/posts/:id/like
// // @access  Private
// const likePost = asyncHandler(async (req, res) => {
//   const post = await Post.findById(req.params.id);

//   if (!post) {
//     res.status(404);
//     throw new Error('Post not found');
//   }

//   const alreadyLiked = post.likes.includes(req.user._id);

//   if (alreadyLiked) {
//     post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
//   } else {
//     post.likes.push(req.user._id);
//   }

//   await post.save();
//   res.json(post);
// });

// module.exports = {
//   createPost,
//   getPosts,
//   likePost
// };
