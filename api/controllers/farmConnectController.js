const Post = require('../models/Post');
const Story = require('../models/Story');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Create a new post
// @route   POST /api/farm-connect/posts
// @access  Private (Farmer only)
const createPost = asyncHandler(async (req, res) => {
  if (req.user.role !== 'farmer') {
    res.status(403);
    throw new Error('Only farmers can create posts');
  }

  const { content } = req.body;

  const post = await Post.create({
    user: req.user._id,
    content,
    images: req.files?.map(file => file.path)
  });

  res.status(201).json({
    success: true,
    data: await post.populate('user', 'name avatar role')
  });
});

// @desc    Get all posts
// @route   GET /api/farm-connect/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('user', 'name avatar role')
    .populate('comments.user', 'name avatar')
    .sort('-createdAt');

  res.json({ success: true, data: posts });
});

// @desc    Like/unlike a post
// @route   POST /api/farm-connect/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const alreadyLiked = post.likes.some(like => like.toString() === req.user._id.toString());

  if (alreadyLiked) {
    post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();

  res.json({
    success: true,
    data: {
      isLiked: !alreadyLiked,
      likes: post.likes
    }
  });
});

// @desc    Add comment to post
// @route   POST /api/farm-connect/posts/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = {
    user: req.user._id,
    content,
    createdAt: new Date()
  };

  post.comments.push(comment);
  await post.save();

  const populatedPost = await Post.findById(post._id)
    .populate('comments.user', 'name avatar');

  res.json({
    success: true,
    data: populatedPost.comments[populatedPost.comments.length - 1]
  });
});

// @desc    Share a post
// @route   POST /api/farm-connect/posts/:id/share
// @access  Private
const sharePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { shares: 1 } },
    { new: true }
  );

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.json({ success: true, data: post });
});

// @desc    Create a new story
// @route   POST /api/farm-connect/stories
// @access  Private (Farmer only)
const createStory = asyncHandler(async (req, res) => {
  if (req.user.role !== 'farmer') {
    res.status(403);
    throw new Error('Only farmers can create stories');
  }

  const { content } = req.body;

  const story = await Story.create({
    user: req.user._id,
    content,
    image: req.file?.path
  });

  res.status(201).json({
    success: true,
    data: await story.populate('user', 'name avatar role')
  });
});

// @desc    Get all stories
// @route   GET /api/farm-connect/stories
// @access  Public
const getStories = asyncHandler(async (req, res) => {
  const stories = await Story.find()
    .populate('user', 'name avatar role')
    .sort('-createdAt');

  res.json({ success: true, data: stories });
});

// @desc    Like/unlike a story
// @route   POST /api/farm-connect/stories/:id/like
// @access  Private
const likeStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  const alreadyLiked = story.likes.some(like => like.toString() === req.user._id.toString());

  if (alreadyLiked) {
    story.likes = story.likes.filter(like => like.toString() !== req.user._id.toString());
  } else {
    story.likes.push(req.user._id);
  }

  await story.save();

  res.json({
    success: true,
    data: {
      isLiked: !alreadyLiked,
      likes: story.likes
    }
  });
});

// @desc    Get farmer profile
// @route   GET /api/farm-connect/farmers/:id
// @access  Public
const getFarmerProfile = asyncHandler(async (req, res) => {
  const farmer = await User.findById(req.params.id)
    .select('-password')
    .populate('products');

  if (!farmer || farmer.role !== 'farmer') {
    res.status(404);
    throw new Error('Farmer not found');
  }

  res.json({ success: true, data: farmer });
});

module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment,
  sharePost,
  createStory,
  getStories,
  likeStory,
  getFarmerProfile
};
