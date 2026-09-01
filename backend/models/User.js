/**
 * ============================================================
 *  models/User.js — The User Mongoose Model
 * ============================================================
 *
 * Stores registered users in the "users" MongoDB collection.
 *
 * Two roles exist:
 *   'admin' — only ONE admin (you). Can edit all portfolio data.
 *   'user'  — visitors who register. Can like/comment (future features).
 *
 * Passwords are NEVER stored as plain text.
 * We use bcryptjs to hash them before saving (see auth route).
 *
 * The pre('save') hook automatically hashes the password
 * whenever a User document is saved with a modified password field.
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,   // No two users can share an email — MongoDB creates an index for this
      lowercase: true, // Always store email in lowercase to avoid duplicates like User@X.com vs user@x.com
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,  // IMPORTANT: password is NEVER returned in query results by default.
                      // You must explicitly request it with .select('+password') to get it.
    },
    role: {
      type: String,
      enum: ['admin', 'user'], // Only these two values are allowed
      default: 'user',         // New registrations are always 'user', never 'admin'
    },
    avatar: { type: String },  // Optional profile picture URL
    // Track when user last logged in (useful for admin dashboard)
    lastLogin: { type: Date },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// ── Pre-save hook: hash password before storing ────────────────
// This hook runs automatically BEFORE every .save() call.
// It only hashes if the password field was actually changed —
// this prevents re-hashing an already-hashed password on unrelated updates.
UserSchema.pre('save', async function (next) {
  // 'this' refers to the User document being saved
  if (!this.isModified('password')) return next(); // Skip if password unchanged

  // bcrypt.hash() takes the plain text password and a "salt rounds" number.
  // 12 rounds means 2^12 = 4096 iterations — slow enough to resist brute force.
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance method: compare passwords ────────────────────────
// Called on a User document instance: user.comparePassword('mypassword')
// Returns true if the plain text password matches the stored hash.
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // We need to explicitly fetch password since select: false hides it by default.
  // But in the login route we already fetch it with .select('+password'),
  // so 'this.password' is available there.
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
