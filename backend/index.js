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
const mapRoutes = require('./routes/map');
const messageRoutes = require('./routes/message');
const characterRoutes = require('./routes/character');

const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.0.29:3000',
  'http://0.0.0.0:3000',
];

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
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

app.use('/uploads', (req, res, next) => {
  console.log('📤 Serving static files from /uploads');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/characters', characterRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  }
});

// ✅ WebSocket Logic
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

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
