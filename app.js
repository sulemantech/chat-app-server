// app.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authMiddleware = require('./auth/authMiddleware');
const sequelize = require('./config/config');
const User = require('./models/user');
const Message = require('./models/message');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Express app middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/message', messageRoutes);

// Socket.io authentication
io.use((socket, next) => {
  // Implement Socket.io authentication here using JWT
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token not provided.'));
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token.'));
    }
    socket.user = decoded;
    next();
  });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username}`);

  // Join a room
  socket.on('join-room', (roomName) => {
    socket.join(roomName);
    console.log(`${socket.user.username} joined room: ${roomName}`);
  });

  // Leave a room
  socket.on('leave-room', (roomName) => {
    socket.leave(roomName);
    console.log(`${socket.user.username} left room: ${roomName}`);
  });

  // Sending a message
  socket.on('send-message', async (data) => {
    try {
      const message = await Message.create({
        text: data.text,
        sender: socket.user.username,
        room: data.room,
      });

      // Broadcast the message to all users in the room except the sender.
      socket.to(data.room).emit('new-message', {
        text: message.text,
        sender: message.sender,
        createdAt: message.createdAt,
      });

      console.log(`Message sent by ${socket.user.username}: ${message.text}`);
    } catch (error) {
      console.error('Error storing message:', error);
    }
  });

  // Typing indicator
  socket.on('typing', (roomName, isTyping) => {
    socket.to(roomName).emit('user-typing', {
      username: socket.user.username,
      isTyping,
    });
  });

  // User presence
  socket.on('user-joined', (roomName) => {
    socket.to(roomName).emit('user-joined', {
      username: socket.user.username,
    });
  });

  socket.on('user-left', (roomName) => {
    socket.to(roomName).emit('user-left', {
      username: socket.user.username,
    });
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.username}`);
    // Perform any cleanup or additional logic on user disconnection.
  });
});

// Start the server
const PORT = 3000;
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
