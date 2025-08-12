const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { authMiddleware } = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const Story = require('../models/Story');

const router = express.Router();

// === Utility: Ensure DB connected ===
function ensureDbConnected(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    console.error('[ERROR] MongoDB not connected. State:', mongoose.connection.readyState);
    return res.status(500).json({ message: 'Database not connected' });
  }
  next();
}

// === Multer setup ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/farm-connect');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' +
      Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// === Helper: Role check ===
const checkRole = (requiredRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'User not authenticated' });
  if (requiredRole && req.user.role !== requiredRole) {
    return res.status(403).json({ message: `Only ${requiredRole}s can perform this action` });
  }
  next();
};

// ===================== POSTS =====================
router.get('/posts', authMiddleware, ensureDbConnected, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: posts.map(post => ({
        ...post,
        id: post._id,
        isLiked: post.likedBy?.some(uid => uid.toString() === req.user.id.toString()) || false
      }))
    });
  } catch (err) {
    console.error('[ERROR] Fetch posts:', err);
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
});

router.post('/posts', authMiddleware, checkRole('farmer'), ensureDbConnected, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.body.content?.trim()) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const imageUrls = req.files?.map(file => `/uploads/farm-connect/${file.filename}`) || [];
    let parsedTags = [];
    try {
      parsedTags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
      if (!Array.isArray(parsedTags)) parsedTags = [parsedTags];
    } catch {
      parsedTags = [];
    }

    const newPost = new Post({
      content: req.body.content.trim(),
      category: req.body.category || 'General',
      author: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
        avatar: req.user.avatar || 'https://placehold.co/100x100'
      },
      images: imageUrls,
      tags: parsedTags,
      location: req.body.location || '',
      privacy: req.body.privacy || 'public'
    });

    await newPost.save();
    res.status(201).json({
      success: true,
      post: { ...newPost.toObject(), id: newPost._id, isLiked: false },
      message: 'Post created successfully'
    });
  } catch (err) {
    console.error('[ERROR] Create post:', err);
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
});

router.post('/posts/:id/like', authMiddleware, ensureDbConnected, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid post ID' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;
    const isLiked = post.likedBy.some(id => id.toString() === userId.toString());
    if (isLiked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes++;
    }
    await post.save();

    res.json({ success: true, data: { isLiked: !isLiked, likes: post.likes } });
  } catch (err) {
    console.error('[ERROR] Like post:', err);
    res.status(500).json({ message: 'Failed to like post', error: err.message });
  }
});

router.post('/posts/:id/comments', authMiddleware, ensureDbConnected, async (req, res) => {
  try {
    if (!req.body.content?.trim()) return res.status(400).json({ message: 'Comment is required' });
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid post ID' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      content: req.body.content.trim(),
      author: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
        avatar: req.user.avatar || 'https://placehold.co/100x100'
      }
    };

    post.comments.unshift(newComment);
    post.commentsCount = post.comments.length;
    await post.save();

    res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    console.error('[ERROR] Add comment:', err);
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
});

router.post('/posts/:id/share', authMiddleware, ensureDbConnected, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid post ID' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.shares = (post.shares || 0) + 1;
    await post.save();

    res.json({ success: true, data: { shares: post.shares } });
  } catch (err) {
    console.error('[ERROR] Share post:', err);
    res.status(500).json({ message: 'Failed to share post', error: err.message });
  }
});

// ===================== STORIES =====================
router.get('/stories', authMiddleware, ensureDbConnected, async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: stories.map(story => ({
        ...story,
        id: story._id,
        isLiked: story.likedBy?.some(uid => uid.toString() === req.user.id.toString()) || false
      }))
    });
  } catch (err) {
    console.error('[ERROR] Fetch stories:', err);
    res.status(500).json({ message: 'Failed to fetch stories', error: err.message });
  }
});

router.post('/stories', authMiddleware, checkRole('farmer'), ensureDbConnected, upload.single('coverImage'), async (req, res) => {
  try {
    if (!req.body.title?.trim() || !req.body.content?.trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const coverImageUrl = req.file ? `/uploads/farm-connect/${req.file.filename}` : null;

    let parsedTags = [];
    try {
      parsedTags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
      if (!Array.isArray(parsedTags)) parsedTags = [parsedTags];
    } catch {
      parsedTags = [];
    }

    let parsedAchievements = [];
    try {
      parsedAchievements =
        typeof req.body.achievements === 'string'
          ? JSON.parse(req.body.achievements)
          : req.body.achievements;
      if (!Array.isArray(parsedAchievements)) parsedAchievements = [];
    } catch {
      parsedAchievements = [];
    }

    const newStory = new Story({
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      excerpt: req.body.excerpt || '',
      category: req.body.category || 'General',
      location: req.body.location || '',
      coverImage: coverImageUrl,
      tags: parsedTags,
      achievements: parsedAchievements,
      timeline: req.body.timeline || '',
      readTime: parseInt(req.body.readTime) || 1,
      author: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
        avatar: req.user.avatar || 'https://placehold.co/100x100'
      }
    });

    await newStory.save();
    res.status(201).json({
      success: true,
      story: { ...newStory.toObject(), id: newStory._id, isLiked: false },
      message: 'Story created successfully'
    });
  } catch (err) {
    console.error('[ERROR] Create story:', err);
    res.status(500).json({ message: 'Failed to create story', error: err.message });
  }
});

router.post('/stories/:id/like', authMiddleware, ensureDbConnected, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid story ID' });

    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const userId = req.user.id;
    const isLiked = story.likedBy.some(id => id.toString() === userId.toString());
    if (isLiked) {
      story.likedBy = story.likedBy.filter(id => id.toString() !== userId.toString());
      story.likes = Math.max(0, story.likes - 1);
    } else {
      story.likedBy.push(userId);
      story.likes++;
    }
    await story.save();

    res.json({ success: true, data: { isLiked: !isLiked, likes: story.likes } });
  } catch (err) {
    console.error('[ERROR] Like story:', err);
    res.status(500).json({ message: 'Failed to like story', error: err.message });
  }
});

module.exports = router;
