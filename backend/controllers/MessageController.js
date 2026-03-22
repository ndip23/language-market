const Message = require('../models/Message');
const Connection = require('../models/Connection');
const mongoose = require('mongoose');

// @desc    Send a private message
// @route   POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const myId = req.user.id;

    // 🚨 THE SECURITY CHECK: Does a booking exist?
    const hasBooking = await Connection.findOne({
      $or: [
        { student: myId, teacher: receiverId },
        { student: receiverId, teacher: myId }
      ],
      // Only allow messaging if the lesson is PAID
      isPaid: true 
    });

    if (!hasBooking) {
      return res.status(403).json({ msg: "You must book a lesson to message this tutor." });
    }

    const message = await Message.create({ sender: myId, receiver: receiverId, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ msg: "Delivery failed" });
  }
};

// @desc    Get private chat history between two users
// @route   GET /api/messages/:otherUserId
exports.getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const myId = req.user.id;

    // Security: Only fetch messages where I am the sender OR receiver
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Security error: Could not fetch private chat." });
  }
};
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const receiverId = req.user.id;

    // Mark all messages FROM this person TO me as Read
    await Message.updateMany(
      { sender: senderId, receiver: receiverId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ msg: "Conversation read" });
  } catch (err) {
    res.status(500).send("Read sync failed");
  }
};

// 2. GET UNREAD COUNTS (WhatsApp Style)
exports.getUnreadCounts = async (req, res) => {
  try {
    const myId = req.user.id;

    // Aggregate: Group by sender and count unread messages for me
    const counts = await Message.aggregate([
      { $match: { receiver: new mongoose.Types.ObjectId(myId), isRead: false } },
      { $group: { _id: "$sender", count: { $sum: 1 } } }
    ]);

    res.json(counts); // Returns e.g. [{_id: 'user123', count: 5}]
  } catch (err) {
    res.status(500).send("Error fetching counts");
  }
};