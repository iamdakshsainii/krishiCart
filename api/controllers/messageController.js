const mongoose = require("mongoose");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content, contentType = "text", relatedOrder } = req.body;

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ success: false, message: "Invalid receiver ID" });
    }

    const receiverUser = await User.findById(receiver).lean();
    if (!receiverUser) {
      return res.status(404).json({ success: false, message: "Receiver not found" });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      content,
      contentType,
      relatedOrder,
      status: "sent"
    });

    const populatedMessage = await message.populate([
      { path: "sender", select: "name role avatar" },
      { path: "receiver", select: "name role avatar" }
    ]);

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name role avatar")
      .populate("receiver", "name role avatar")
      .lean();

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all conversations
exports.getConversations = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userObjectId }, { receiver: userObjectId }]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userObjectId] },
              "$receiver",
              "$sender"
            ]
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", userObjectId] },
                    { $eq: ["$isRead", false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          user: { _id: 1, name: 1, role: 1, avatar: 1 },
          lastMessage: {
            content: "$lastMessage.content",
            contentType: "$lastMessage.contentType",
            createdAt: "$lastMessage.createdAt",
            isRead: "$lastMessage.isRead",
            status: "$lastMessage.status"
          },
          unreadCount: 1
        }
      }
    ]);

    res.json({ success: true, count: conversations.length, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { $set: { isRead: true, status: "read" } }
    );

    res.json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
