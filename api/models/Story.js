// models/Story.js
const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {  // Main reference for the author, matches backend
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String },
  coverImage: { type: String, required: true },
  timeline: { type: String },
  tags: [{ type: String }],
  achievements: [{ label: String, value: String }],
  readTime: { type: Number, default: 5 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // track users who like
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  comments: [
    {
      content: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
