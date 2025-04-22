// 📂 backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Campaign = require('./models/Campaign');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// 🧠 Init Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// 🌐 Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://192.168.') || origin === 'http://localhost:3000') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 📁 Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔌 Inject io into every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 🔌 Socket.IO Handlers
io.on('connection', (socket) => {
  console.log('🧠 Socket connected:', socket.id);

  socket.on('join-campaign', async (campaignId) => {
    socket.join(campaignId);
    console.log(`🎯 ${socket.id} joined campaign ${campaignId}`);

    try {
      const campaign = await Campaign.findById(campaignId);
      if (campaign?.mapUrl) {
        socket.emit('map-uploaded', { imageUrl: campaign.mapUrl });
      }
    } catch (err) {
      console.error('❌ Failed to fetch campaign map:', err);
    }

    // Optional debug
    setTimeout(() => {
      io.to(campaignId).emit('debug-ping', { message: `Ping to ${campaignId}` });
    }, 2000);
  });

  socket.on('chat-message', (data) => {
    io.to(data.campaignId).emit('chat-message', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// ✅ Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/characters', require('./routes/character'));
app.use('/api/campaigns', require('./routes/campaign'));
app.use('/api/messages', require('./routes/message'));
app.use('/api/maps', require('./routes/map'));

// 🚀 Production: Serve static frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

// 🟢 Launch
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
