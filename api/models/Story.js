// models/Story.js
const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String },
  coverImage: { type: String },
  timeline: { type: String },
  tags: [{ type: String }],
  achievements: [{ label: String, value: String }],
  readTime: { type: Number, default: 5 },
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    avatar: String,
    role: String
  },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  comments: [
    {
      content: String,
      author: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        avatar: String,
        role: String
      },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
