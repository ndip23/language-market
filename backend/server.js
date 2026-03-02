const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// 1. Initialize 'app' FIRST
const app = express();
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});
app.use(helmet());
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  next();
})
app.use(xss());
app.use(hpp());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use('/api/auth/login', limiter);
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS Security Policy'));
    }
  },
  credentials: true
}));

// 2. Now create the 'server' using the initialized 'app'
const server = http.createServer(app);

// 3. Initialize Socket.io using that 'server'
const io = new Server(server, { 
  cors: { origin: "*" },
  methods: ["GET", "POST"]  
});

// Socket logic
io.on('connection', (socket) => {
  console.log('A user connected to Socket.io');
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room.`);
  });

  socket.on('send_message', (data) => {
    io.to(data.receiverId).emit('receive_message', {
        sender: data.sender,
        content: data.content,
        senderName: data.senderName
    });
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
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));


const PORT = process.env.PORT || 5000;

// 4. IMPORTANT: Change 'app.listen' to 'server.listen'
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));