const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // ✅ Add this if not already
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

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

// ✅ Serve static files like campaign images or avatars
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/user', require('./routes/user'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/characters', require('./routes/character'));
app.use('/api/campaigns', require('./routes/campaign'));
app.use('/api/messages', require('./routes/message'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
