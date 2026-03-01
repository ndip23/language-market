const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content
    });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ msg: "Message failed to send" });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: "Could not fetch chat" });
  }
};
const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: otherUserId },
      { sender: otherUserId, receiver: req.user.id }
    ]
  }).sort('createdAt');
  res.json(messages);
};

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const message = await Message.create({ sender: req.user.id, receiver: receiverId, content });
  res.status(201).json(message);
};