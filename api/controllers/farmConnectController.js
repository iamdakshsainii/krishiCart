const Post = require('../models/Post');
const Story = require('../models/Story');
const User = require('../models/UserModel');
const FarmerProfile = require('../models/FarmerProfileModel');
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

// Utility to validate uploaded files
const validateUploadedFile = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'], maxSize = 5 * 1024 * 1024) => {
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }

  if (file.size > maxSize) {
    throw new Error(`File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
  }

  return true;
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
  try {
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
  } catch (error) {
    console.error('Error in likePost:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error liking post'
    });
  }
});

// = ADD COMMENT =
const addComment = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in addComment:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error adding comment'
    });
  }
});

// = SHARE POST =
const sharePost = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in sharePost:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error sharing post'
    });
  }
});

// = CREATE STORY =
const createStory = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in createStory:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error creating story'
    });
  }
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
  try {
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
  } catch (error) {
    console.error('Error in likeStory:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error liking story'
    });
  }
});

// = GET FARMER PROFILE =
const getFarmerProfile = asyncHandler(async (req, res) => {
  try {
    console.log('Getting farmer profile for ID:', req.params.id);

    validateId(req.params.id, 'farmer ID');

    const farmer = await User.findById(req.params.id)
      .select('-password');

    if (!farmer) {
      console.log('Farmer not found with ID:', req.params.id);
      res.status(404);
      throw new Error('Farmer not found');
    }

    if (farmer.role !== 'farmer') {
      console.log('User found but role is not farmer:', farmer.role);
      res.status(404);
      throw new Error('User is not a farmer');
    }

    console.log('Farmer profile found successfully');
    res.json({ success: true, data: farmer });
  } catch (error) {
    console.error('Error in getFarmerProfile:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error fetching farmer profile',
      error: error.message
    });
  }
});

// = UPDATE FARMER PROFILE =
const updateFarmerProfile = asyncHandler(async (req, res) => {
  try {
    console.log('Update farmer profile request received');
    const { id } = req.params;

    // Validate ObjectId
    validateId(id, 'farmer ID');

    // Check if user is authenticated and authorized
    if (!req.user || req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    // Verify user exists and is a farmer
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'farmer') {
      return res.status(403).json({
        success: false,
        message: 'Only farmers can update farmer profiles'
      });
    }

    let profileData;
    try {
      profileData = JSON.parse(req.body.profileData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile data format. Expected valid JSON.'
      });
    }

    // Validate required fields
    if (!profileData.farmName || !profileData.farmName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Farm name is required'
      });
    }

    console.log('Profile data:', profileData);

    // Handle photo uploads
    let profilePhotoPath = '';
    let coverPhotoPath = '';

    if (req.files?.profilePhoto) {
      const profilePhoto = Array.isArray(req.files.profilePhoto)
        ? req.files.profilePhoto[0]
        : req.files.profilePhoto;
      profilePhotoPath = profilePhoto.path || profilePhoto.tempFilePath;
      console.log('Profile photo uploaded:', profilePhotoPath);
    }

    if (req.files?.coverPhoto) {
      const coverPhoto = Array.isArray(req.files.coverPhoto)
        ? req.files.coverPhoto[0]
        : req.files.coverPhoto;
      coverPhotoPath = coverPhoto.path || coverPhoto.tempFilePath;
      console.log('Cover photo uploaded:', coverPhotoPath);
    }

    // Validate email format if provided
    if (profileData.email && profileData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
    }

    // Update user basic data
    const userUpdateData = {
      name: profileData.farmName.trim(),
      ...(profileData.phone && { phone: profileData.phone.trim() }),
      ...(profileData.email && { email: profileData.email.trim() }),
    };

    if (profilePhotoPath) {
      userUpdateData.avatar = profilePhotoPath;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      userUpdateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update user data'
      });
    }

    // Validate farming practices if provided
    let validatedPractices = [];
    if (profileData.farmingPractices && Array.isArray(profileData.farmingPractices)) {
      const allowedPractices = [
        'Organic', 'Conventional', 'Sustainable', 'Hydroponic',
        'Permaculture', 'Biodynamic', 'Precision Agriculture'
      ];
      validatedPractices = profileData.farmingPractices.filter(
        practice => allowedPractices.includes(practice)
      );
    }

    // Validate established year
    let establishedYear;
    if (profileData.establishedYear) {
      const year = parseInt(profileData.establishedYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1800 || year > currentYear) {
        return res.status(400).json({
          success: false,
          message: `Established year must be between 1800 and ${currentYear}`
        });
      }
      establishedYear = year;
    }

    // Create or update farmer profile
    let farmerProfile = await FarmerProfile.findOne({ farmer: id });

    const profileUpdateData = {
      farmer: id,
      farmName: profileData.farmName.trim(),
      ...(profileData.description && { description: profileData.description.trim() }),
      ...(establishedYear && { establishedYear }),
      farmingPractices: validatedPractices,
      socialMedia: profileData.socialMedia || {},
      businessHours: profileData.businessHours || {},
    };

    if (coverPhotoPath) {
      profileUpdateData.coverPhoto = coverPhotoPath;
    }

    if (farmerProfile) {
      // Update existing profile
      farmerProfile = await FarmerProfile.findOneAndUpdate(
        { farmer: id },
        profileUpdateData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      farmerProfile = await FarmerProfile.create(profileUpdateData);
    }

    // Populate the updated profile
    const populatedProfile = await FarmerProfile.findById(farmerProfile._id)
      .populate('farmer', '-password')
      .exec();

    console.log('Profile updated successfully');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        farmer: updatedUser,
        profile: populatedProfile
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
});

// = UPLOAD FARMER PHOTOS =
const uploadFarmerPhotos = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    validateId(id, 'farmer ID');

    if (!req.user || req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload photos'
      });
    }

    let profilePhotoPath = '';
    let coverPhotoPath = '';

    // Validate and process profile photo
    if (req.files?.profilePhoto) {
      const profilePhoto = Array.isArray(req.files.profilePhoto)
        ? req.files.profilePhoto[0]
        : req.files.profilePhoto;

      try {
        validateUploadedFile(profilePhoto);
        profilePhotoPath = profilePhoto.path || profilePhoto.tempFilePath;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `Profile photo error: ${error.message}`
        });
      }
    }

    // Validate and process cover photo
    if (req.files?.coverPhoto) {
      const coverPhoto = Array.isArray(req.files.coverPhoto)
        ? req.files.coverPhoto[0]
        : req.files.coverPhoto;

      try {
        validateUploadedFile(coverPhoto);
        coverPhotoPath = coverPhoto.path || coverPhoto.tempFilePath;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `Cover photo error: ${error.message}`
        });
      }
    }

    // Update user avatar if profile photo uploaded
    if (profilePhotoPath) {
      await User.findByIdAndUpdate(id, { avatar: profilePhotoPath });
    }

    // Update farmer profile cover photo
    if (coverPhotoPath) {
      await FarmerProfile.findOneAndUpdate(
        { farmer: id },
        { coverPhoto: coverPhotoPath },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: 'Photos uploaded successfully',
      data: {
        profilePhoto: profilePhotoPath,
        coverPhoto: coverPhotoPath
      }
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to upload photos'
    });
  }
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
  getFarmerProfile,
  updateFarmerProfile,
  uploadFarmerPhotos
};
