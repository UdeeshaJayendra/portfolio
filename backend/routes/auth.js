/**
 * ============================================================
 *  routes/auth.js — Admin Authentication Routes
 * ============================================================
 *
 * POST /api/auth/login  → admin logs in, receives JWT token
 * GET  /api/auth/me     → verify token + get current user info
 *
 * There is NO /register route.
 * The admin account is created once via: node backend/seed.js
 */

const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { auth } = require('../middleware/auth');

// Helper: sign a JWT token with user info embedded in the payload
const createToken = (user) => jwt.sign(
  { userId: user._id, email: user.email, name: user.name, role: user.role },
  process.env.JWT_SECRET || 'changeme_in_production',
  { expiresIn: '7d' } // Token expires after 7 days — user must log in again
);

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    // Find user — include password field (hidden by default via select: false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password.' });

    // Update last login time
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = createToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
// Used by the frontend on page load to restore the session.
// The JWT interceptor in api.js sends the stored token automatically.
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;