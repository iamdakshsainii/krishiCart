require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post'); // Adjust path if needed
const Story = require('./models/Story'); // Adjust path if needed

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_database';

const cleanupDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const deletedPosts = await Post.deleteMany({});
    console.log(`Deleted ${deletedPosts.deletedCount} posts`);

    const deletedStories = await Story.deleteMany({});
    console.log(`Deleted ${deletedStories.deletedCount} stories`);

    console.log('Database cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

cleanupDatabase();
