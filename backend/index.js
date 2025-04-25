const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load env variables
dotenv.config();

// Import routes
const authRoutes = require('./controllers/authController');
const userRoutes = require('./routes/user');
const campaignRoutes = require('./routes/campaign');
const mapRoutes = require('./controllers/mapController');
const messageRoutes = require('./controllers/messageController');

// Allowed origins for dev/local network
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.0.29:3000', // local network
  'http://0.0.0.0:3000',       // optional
];

// Init express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    console.log('🧪 CORS origin check:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(helmet());
app.use(morgan('dev'));

// Static file serving with correct CORP header
app.use('/uploads', (req, res, next) => {
  console.log('📤 Serving static files from /uploads');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Create HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  }
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log('📡 New WebSocket connection:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
