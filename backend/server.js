const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

// 1. Initialize 'app' FIRST
const app = express();

// 2. Now create the 'server' using the initialized 'app'
const server = http.createServer(app);

// 3. Initialize Socket.io using that 'server'
const io = new Server(server, { 
  cors: { origin: "*" } 
});

// Socket logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
  });

  socket.on('send_message', (data) => {
    io.to(data.receiverId).emit('receive_message', data);
  });
});

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Define API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes')); 
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

const PORT = process.env.PORT || 5000;

// 4. IMPORTANT: Change 'app.listen' to 'server.listen'
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));