const express = require("express");
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
} = require("../controllers/messageController");
const { verifyToken } = require("../utils/authMiddleware");

const router = express.Router();

// Send a message
router.post("/", verifyToken, sendMessage);

// Get all conversations for the logged-in user
router.get("/", verifyToken, getConversations);

// Get all messages between logged-in user and another user
router.get("/:userId", verifyToken, getConversation);

// Mark messages from a specific user as read
router.put("/read/:userId", verifyToken, markAsRead);

module.exports = router;
