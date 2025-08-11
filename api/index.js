const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const connectDB = require("./db/connection");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("KrishiCart API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ Chat endpoint for AI assistant
app.post('/api/chat', async (req, res) => {
  console.log('🔥 Chat request received:', req.body);

  try {
    const { message } = req.body;

    if (!message) {
      console.log('❌ No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ OpenAI API key not found in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('OPENAI')));
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    console.log('✅ API Key found, making request to OpenAI...');

    // For Node.js < 18, you might need to install and use node-fetch
    let fetch;
    if (typeof globalThis.fetch === 'undefined') {
      try {
        fetch = require('node-fetch');
        console.log('✅ Using node-fetch');
      } catch (err) {
        console.log('❌ node-fetch not available, install it: npm install node-fetch');
        return res.status(500).json({ error: 'Fetch not available' });
      }
    } else {
      fetch = globalThis.fetch;
      console.log('✅ Using native fetch');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `आप एक खेती विशेषज्ञ हैं जो हिंदी में किसानों की मदद करते हैं।
            आप निम्नलिखित विषयों पर जानकारी दे सकते हैं:
            - फसल की खेती (गेहूं, चावल, मक्का, दाल, सब्जियां)
            - मिट्टी की जांच और उर्वरक
            - बीज की किस्में और बुआई का समय
            - कीट-पतंगों से बचाव
            - आधुनिक खेती की तकनीकें
            - सिंचाई की विधियां
            - फसल की कटाई और भंडारण

            हमेशा व्यावहारिक और उपयोगी सलाह दें।`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    console.log('📡 OpenAI Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenAI API Error:', errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || 'OpenAI API Error',
        details: errorData
      });
    }

    const data = await response.json();
    const replyPreview = data.choices?.[0]?.message?.content?.substring(0, 100) + '...';
    console.log('✅ OpenAI Response received:', replyPreview);

    const reply = data.choices?.[0]?.message?.content || 'माफ करें, मुझे उत्तर नहीं मिला।';

    res.json({ reply });

  } catch (error) {
    console.error('💥 Complete Error Details:', error.message);
    console.error('💥 Error Stack:', error.stack);

    res.status(500).json({
      error: 'Server error occurred while processing chat request',
      details: error.message
    });
  }
});

// Test endpoint to check if chat route works
app.get('/api/chat/test', (req, res) => {
  res.json({
    message: 'Chat endpoint is working!',
    hasApiKey: !!process.env.OPENAI_API_KEY,
    nodeVersion: process.version
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/chat/test`);
});
