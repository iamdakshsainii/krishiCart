const Post = require('../models/Post');
const Story = require('../models/Story');
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// Utility to validate MongoDB ObjectId
const validateId = (id, name = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error(`Invalid ${name}`);
    err.statusCode = 400;
    throw err;
  }
};

// = CREATE POST =
const createPost = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'farmer') {
    res.status(403);
    throw new Error('Only farmers can create posts');
  }

  const { content } = req.body;
  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Post content is required');
  }

  let images = [];
  if (req.files?.images) {
    if (Array.isArray(req.files.images)) {
      images = req.files.images.map(file => file.path || file.tempFilePath);
    } else {
      images = [req.files.images.path || req.files.images.tempFilePath];
    }
  }

  const post = await Post.create({
    user: req.user._id,
    content: content.trim(),
    images
  });

  res.status(201).json({
    success: true,
    data: await post.populate('user', 'name avatar role')
  });
});

// = GET POSTS =
const getPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name avatar role')
      .populate('comments.user', 'name avatar')
      .sort('-createdAt')
      .lean();

    res.json({ success: true, data: Array.isArray(posts) ? posts : [] });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: err.message
    });
  }
});

// = LIKE/UNLIKE POST =
const likePost = asyncHandler(async (req, res) => {
  validateId(req.params.id, 'post ID');

  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (!Array.isArray(post.likes)) {
    post.likes = [];
  }

  const alreadyLiked = post.likes.some(
    like => like.toString() === req.user._id.toString()
  );

  post.likes = alreadyLiked
    ? post.likes.filter(like => like.toString() !== req.user._id.toString())
    : [...post.likes, req.user._id];

  await post.save();

  res.json({ success: true, data: { isLiked: !alreadyLiked, likes: post.likes } });
});

// = ADD COMMENT =
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  validateId(req.params.id, 'post ID');

  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.comments.push({
    user: req.user._id,
    content: content.trim(),
    createdAt: new Date()
  });

  await post.save();

  const populatedPost = await Post.findById(post._id)
    .populate('comments.user', 'name avatar');

  res.json({
    success: true,
    data: populatedPost.comments[populatedPost.comments.length - 1]
  });
});

// = SHARE POST =
const sharePost = asyncHandler(async (req, res) => {
  validateId(req.params.id, 'post ID');

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

// = CREATE STORY =
const createStory = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'farmer') {
    res.status(403);
    throw new Error('Only farmers can create stories');
  }

  const {
    title,
    content,
    category,
    excerpt,
    tags,
    achievements,
    timeline,
    readTime
  } = req.body;

  if (!title || !content || !category) {
    res.status(400);
    throw new Error('Title, content, and category are required');
  }

  const allowedCategories = [
    'Success Stories', 'Farming Tips', 'Organic Farming', 'Career Change',
    'Women Empowerment', 'Technology in Farming', 'Sustainable Practices',
    'Community Impact', 'Innovation', 'Challenges Overcome', 'Market Insights',
    'Weather & Climate', 'Crop Management', 'Livestock Care'
  ];

  if (!allowedCategories.includes(category)) {
    res.status(400);
    throw new Error('Invalid category');
  }

  let coverImagePath = '';
  if (req.files?.coverImage) {
    coverImagePath = Array.isArray(req.files.coverImage)
      ? req.files.coverImage[0].path || req.files.coverImage[0].tempFilePath
      : req.files.coverImage.path || req.files.coverImage.tempFilePath;
  } else if (req.file) {
    coverImagePath = req.file.path;
  } else if (req.body.coverImage && typeof req.body.coverImage === 'string') {
    coverImagePath = req.body.coverImage.trim();
  }

  if (!coverImagePath) {
    res.status(400);
    throw new Error('Cover image is required (file or URL)');
  }

  let parsedTags = [];
  let parsedAchievements = [];
  try { parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || []; } catch {}
  try { parsedAchievements = typeof achievements === 'string' ? JSON.parse(achievements) : achievements || []; } catch {}

  const story = await Story.create({
    user: req.user._id,
    title: title.trim(),
    content: content.trim(),
    category,
    coverImage: coverImagePath,
    excerpt: excerpt || '',
    tags: parsedTags,
    achievements: parsedAchievements,
    timeline: timeline || '',
    readTime: readTime || 1
  });

  res.status(201).json({
    success: true,
    data: await story.populate('user', 'name avatar role')
  });
});

// = GET STORIES =
const getStories = asyncHandler(async (req, res) => {
  try {
    const stories = await Story.find()
      .populate({ path: 'user', select: 'name avatar role', options: { lean: true } })
      .sort('-createdAt')
      .lean();

    res.json({ success: true, data: Array.isArray(stories) ? stories : [] });
  } catch (err) {
    console.error('Error fetching stories:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching stories',
      error: err.message
    });
  }
});

// = LIKE/UNLIKE STORY =
const likeStory = asyncHandler(async (req, res) => {
  validateId(req.params.id, 'story ID');

  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const story = await Story.findById(req.params.id);
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  if (!Array.isArray(story.likes)) {
    story.likes = [];
  }

  const alreadyLiked = story.likes.some(
    like => like.toString() === req.user._id.toString()
  );

  story.likes = alreadyLiked
    ? story.likes.filter(like => like.toString() !== req.user._id.toString())
    : [...story.likes, req.user._id];

  await story.save();

  res.json({ success: true, data: { isLiked: !alreadyLiked, likes: story.likes } });
});

// = GET FARMER PROFILE =
const getFarmerProfile = asyncHandler(async (req, res) => {
  validateId(req.params.id, 'farmer ID');

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
