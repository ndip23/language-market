const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
const hpp = require('hpp');
require('dotenv').config();

// 1. Initialize Express App
const app = express();

// 2. Body Parser (Must be at the top so data is available to other middleware)
app.use(express.json({ limit: '10kb' })); // Limits body size for security

// 3. Security Headers (Helmet)
// Note: Adjusted for Cloudinary and Socket.io compatibility
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

// 4. Custom Logger
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// 5. Data Sanitization (Against NoSQL Injection)
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  next();
});

// 6. Prevent HTTP Parameter Pollution
app.use(hpp());

// 7. Production CORS Configuration
const allowedOrigins = [
  "https://learnlanguagehelp.site",
  "https://www.learnlanguagehelp.site",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS Security Policy'));
    }
  },
  credentials: true
}));

// 8. Rate Limiting (Brute Force Protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again in 15 minutes"
});
app.use('/api/auth/login', limiter);

// 9. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected...'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 10. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes')); 
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// 11. Create HTTP Server for Socket.io
const server = http.createServer(app);

// 12. Initialize Socket.io
const io = new Server(server, { 
  cors: { 
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// 13. Socket.io Logic (Private Rooms)
io.on('connection', (socket) => {
  console.log('A user connected to Socket.io');

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room.`);
  });

  socket.on('send_message', (data) => {
    // Logic: Deliver message specifically to the receiver's room
    io.to(data.receiverId).emit('receive_message', {
        sender: data.sender,
        content: data.content,
        senderName: data.senderName
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// 14. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Luxury Server Active on Port ${PORT}`);
});