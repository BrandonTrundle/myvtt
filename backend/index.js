/**
 * Author: Brandon Trundle
 * File Name: index.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Initializes and configures the ArcanaTable backend server.
 * Responsibilities include:
 * - Setting up Express with security, CORS, and static file serving
 * - Connecting to MongoDB via Mongoose
 * - Setting up API routes for authentication, user management, campaigns, maps, messages, and characters
 * - Initializing and handling real-time WebSocket communication using Socket.IO
 */


const express = require('express'); // Express.js web framework
const mongoose = require('mongoose'); // Mongoose library for MongoDB object modeling
const dotenv = require('dotenv'); // Loads environment variables from .env file
const cors = require('cors'); // Middleware for enabling CORS
const helmet = require('helmet'); // Middleware for securing HTTP headers
const morgan = require('morgan'); // HTTP request logger middleware
const path = require('path'); // Node.js core module for working with file paths
const http = require('http'); // Node.js core module for creating HTTP servers
const { Server } = require('socket.io'); // Socket.IO server for WebSocket communication

// Load environment variables from .env file
dotenv.config();

// Import application routes
const authRoutes = require('./controllers/authController');
const userRoutes = require('./routes/user');
const campaignRoutes = require('./routes/campaign');
const mapRoutes = require('./routes/map');
const messageRoutes = require('./routes/message');
const characterRoutes = require('./routes/character');

/**
 * Set up CORS policy to allow only whitelisted client origins.
 * Supports localhost development and local network connections.
 */
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.0.29:3000',
  'http://0.0.0.0:3000',
];

const app = express();

/**
 * Middleware Setup:
 * - Parse incoming JSON requests with a 5MB limit.
 */
app.use(express.json({ limit: '5mb' }));

/**
 * - Parse incoming URL-encoded payloads with a 5MB limit.
 */
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

/**
 * - Enable Cross-Origin Resource Sharing (CORS) with dynamic origin checking.
 * - Only allow whitelisted origins for security.
 */
app.use(cors({
  origin: function (origin, callback) {
    // console.log('🧪 CORS origin check:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

/**
 * - Secure HTTP headers with Helmet.
 */
app.use(helmet());

/**
 * - Log HTTP requests to console using Morgan (development mode).
 */
app.use(morgan('dev'));

/**
 * - Serve static files from the '/uploads' directory.
 * - Set appropriate CORS headers for cross-origin resource access.
 */
app.use('/uploads', (req, res, next) => {
  console.log('📤 Serving static files from /uploads');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

/**
 * API Routes Setup:
 * - Mount application route modules under specific base paths.
 */
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/characters', characterRoutes);


/**
 * Connect to MongoDB using Mongoose.
 * Exits the process on connection failure.
 */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

  /**
 * Create HTTP server and initialize Socket.IO for real-time communication.
 * Configures CORS to allow only approved origins.
 */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  }
});

/**
 * Handle WebSocket connections:
 * - debug_ping: test WebSocket connectivity
 * - join_campaign: allow clients to join specific campaign rooms
 * - chat_message: broadcast chat and dice messages to a campaign room
 * - map_settings_updated: broadcast map grid/setting updates
 * - map_updated: broadcast active map changes
 * - disconnect: handle client disconnections
 */
io.on('connection', (socket) => {
  console.log('📡 New WebSocket connection:', socket.id);

  socket.on('debug_ping', (data) => {
    console.log('🐛 DEBUG PING received from client:', data);
    socket.emit('debug_pong', { message: 'Pong from server!' });
  });

  socket.on('join_campaign', (campaignId) => {
    if (campaignId) {
      socket.join(campaignId);
      console.log(`✅ ${socket.id} joined campaign room ${campaignId}`);
    } else {
      console.warn('⚠️ join_campaign called without campaignId');
    }
  });

  socket.on('chat_message', (data) => {
    console.log('📥 Server received chat_message:', data);

    const { campaignId, username, message, type, diceType, rolls, isNat20, isNat1 } = data;
    if (!campaignId || !message) {
      console.warn('⚠️ Invalid chat message payload:', data);
      return;
    }

    console.log(`📤 Server relaying to room ${campaignId}:`, {
      username,
      message,
      type,
      diceType,
      rolls,
      isNat20,
      isNat1,
    });

    io.to(campaignId).emit('chat_message', {
      username,
      message,
      type,
      diceType,
      rolls,
      isNat20,
      isNat1,
    });
  });

  socket.on('map_settings_updated', (data) => {
    const { campaignId, ...settings } = data;
    if (!campaignId) return;

    io.to(campaignId).emit('map_settings_updated', {
      ...settings,
      campaignId,
    });
    console.log(`🗺️ Map update relayed to ${campaignId}:`, settings);
  });

  socket.on('map_updated', (data) => {
    const { campaignId, activeMap } = data;
    if (!campaignId || !activeMap) {
      console.warn('⚠️ Invalid MAP_UPDATED payload:', data);
      return;
    }

    console.log(`📡 Server received MAP_UPDATED for ${campaignId}:`, activeMap);

    io.to(campaignId).emit('map_updated', { activeMap });
  });

  socket.on('token_spawned', (data) => {
    const { campaignId, ...tokenData } = data;
    if (!campaignId) {
      console.warn('⚠️ Invalid TOKEN_SPAWNED payload:', data);
      return;
    }
  
    console.log(`🎯 Server received TOKEN_SPAWNED for ${campaignId}:`, tokenData);
  
    io.to(campaignId).emit('token_spawned', { ...tokenData });
  });

  socket.on('token_moved', (data) => {
    const { campaignId, ...tokenData } = data;
    if (!campaignId) {
      console.warn('⚠️ Invalid TOKEN_MOVED payload:', data);
      return;
    }
  
    console.log(`🎯 Server received TOKEN_MOVED for ${campaignId}:`, tokenData);
  
    io.to(campaignId).emit('token_moved', { ...tokenData });
  });

  socket.on('player_measuring', (data) => {
    const { campaignId, tokenId, from, to } = data;
    
    if (!campaignId) {
      console.warn('⚠️ Invalid PLAYER_MEASURING payload:', data);
      return;
    }
  
    //console.log(`📏 Relaying PLAYER_MEASURING for campaign ${campaignId}`, { tokenId, from, to });
  
    // Rebroadcast the measuring event to everyone else in the same campaign room
    socket.to(campaignId).emit('player_measuring', { tokenId, from, to });
  });

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected:', socket.id);
  });
});

/**
 * Start the HTTP server on the specified port.
 */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
