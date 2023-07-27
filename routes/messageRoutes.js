const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/authMiddleware');

// Message model (assuming you have already defined the Message model)
const Message = require('../models/message');

// Route for sending messages
router.post('/send', authMiddleware, async (req, res) => {
  try {
    // Implement sending a message logic here.
    // This route should be protected by the authMiddleware to ensure only authenticated users can send messages.

    const { text, room } = req.body;

    // You can use req.user.username to get the sender's username from the authenticated user.

    const message = await Message.create({
      text,
      sender: req.user.username,
      room,
    });

    // Broadcast the message to all users in the room using Socket.io.
    io.to(room).emit('new-message', {
      text: message.text,
      sender: message.sender,
      createdAt: message.createdAt,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;
