const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware: Allow all origins for local testing (safe inside your LAN)
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

// ✅ Serve static files (e.g. avatar images)
app.use('/uploads', express.static('uploads'));

// ✅ File upload routes (no JSON/body parsing needed)
app.use('/api/user', require('./routes/user'));

// ✅ JSON and urlencoded body parsing for remaining routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Other API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/characters', require('./routes/character'));

// ✅ Start server on all interfaces (for LAN access)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
