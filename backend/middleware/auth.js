/**
 * ============================================================
 *  middleware/auth.js — Authentication & Authorization
 * ============================================================
 *
 * What is middleware?
 *   In Express, middleware is a function that runs BETWEEN
 *   receiving a request and sending a response.
 *   It has access to (req, res, next).
 *   Calling next() passes control to the next middleware/route.
 *   NOT calling next() stops the request there.
 *
 * This file exports THREE things:
 *
 *   1. auth       — verifies the JWT token in the request header.
 *                   Attaches the decoded user to req.user.
 *                   Rejects with 401 if token is missing/invalid.
 *
 *   2. adminOnly  — checks that req.user.role === 'admin'.
 *                   Must come AFTER auth in the middleware chain.
 *                   Rejects with 403 if user is not admin.
 *
 *   3. optionalAuth — reads the token if present but doesn't
 *                   reject if missing. Useful for routes that
 *                   behave differently for logged-in users.
 *
 * How JWT works:
 *   1. User logs in → server creates a signed token containing
 *      { userId, role, email } and sends it to the client.
 *   2. Client stores token (localStorage) and sends it in every
 *      subsequent request as: Authorization: Bearer <token>
 *   3. Server verifies the signature with JWT_SECRET. If it
 *      matches, the token is genuine and hasn't been tampered with.
 */

const jwt = require('jsonwebtoken');

// ── Middleware 1: auth ─────────────────────────────────────────
// Protects a route — the request must carry a valid JWT token.
const auth = (req, res, next) => {
  // The token arrives in the Authorization header as "Bearer eyJ..."
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', ''); // Remove the "Bearer " prefix

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // jwt.verify() checks:
    //   a) The token signature is valid (signed with JWT_SECRET)
    //   b) The token has not expired (checks exp claim)
    // If either fails, it throws an error caught below.
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme_in_production');

    // Attach the decoded payload to req so downstream routes can use it.
    // decoded = { userId, email, role, iat, exp }
    req.user = decoded;
    next(); // ✅ Token valid — continue to the route handler
  } catch (err) {
    // TokenExpiredError or JsonWebTokenError
    res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

// ── Middleware 2: adminOnly ────────────────────────────────────
// Must be used AFTER auth. Checks the role inside the token.
const adminOnly = (req, res, next) => {
  // req.user was set by the auth middleware above
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden. Admin privileges required.'
      // 403 = Forbidden (authenticated but not authorised)
    });
  }
  next(); // ✅ User is admin — continue
};

// ── Middleware 3: optionalAuth ─────────────────────────────────
// Reads the token if present but does NOT reject if missing.
// Sets req.user if token is valid, otherwise req.user = null.
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'changeme_in_production');
  } catch {
    req.user = null; // Invalid token treated same as no token
  }
  next();
};

module.exports = { auth, adminOnly, optionalAuth };
