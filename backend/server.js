/**
 * ============================================================
 *  server.js — Main Express Backend Entry Point
 * ============================================================
 * Boots the Express app, connects to MongoDB, mounts all routes.
 */

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
// Load .env from THIS file's folder (backend/) explicitly, so it always
// works no matter what directory the process is started from.
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
app.set('trust proxy', 1);

// ── Security middleware ────────────────────────────────────────
app.use(helmet());  // Adds 14 secure HTTP headers automatically
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // Required for Authorization header to be sent
}));
app.use(express.json()); // Parse JSON request bodies into req.body

// ── Rate limiter ───────────────────────────────────────────────
// Max 100 requests per 15 minutes per IP — protects against abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, try again later.' },
});
app.use('/api/', limiter);

// ── API Routes ─────────────────────────────────────────────────
// Public portfolio data routes (read-only for visitors)
app.use('/api/profile',        require('./routes/profile'));
app.use('/api/projects',       require('./routes/projects'));
app.use('/api/skills',         require('./routes/skills'));
app.use('/api/experience',     require('./routes/experience'));
app.use('/api/education',      require('./routes/education'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/contact',        require('./routes/contact'));

// Auth routes — login, register, get current user
app.use('/api/auth', require('./routes/auth'));

// Health check — visit http://localhost:5000/api/health to verify server is up
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// ── Global error handler ───────────────────────────────────────
// Catches any error passed via next(err) from route handlers
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Connect to MongoDB then start server ──────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔑 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });
