/**
 * ============================================================
 *  models/Profile.js — The Profile Mongoose Model
 * ============================================================
 *
 * A "model" is a JavaScript class that represents one MongoDB
 * collection. Mongoose uses a "schema" to define what fields
 * a document in that collection can have, their types, and
 * any validation rules.
 *
 * This model has only ONE document (your personal info).
 * The seed.js and profile route use findOne() to always
 * read/update that single document.
 */

const mongoose = require('mongoose');

// ── Schema definition ─────────────────────────────────────────
// Each key is a field name. The value describes its type and rules.
const ProfileSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },  // required: true = MongoDB rejects saves without this
    title:     { type: String, required: true },  // e.g. "Full Stack Developer"
    tagline:   { type: String },                  // Short hero sentence
    bio:       { type: String },                  // Longer about-me paragraph
    email:     { type: String, required: true },
    phone:     { type: String },
    location:  { type: String },
    github:    { type: String },
    linkedin:  { type: String },
    website:   { type: String },
    twitter:   { type: String },
    avatar:    { type: String },                  // URL to profile photo
    resumeUrl: { type: String },                  // URL to hosted PDF resume
  },
  {
    timestamps: true,
    // timestamps: true automatically adds two fields to every document:
    //   createdAt — set once when document is first saved
    //   updatedAt — updated every time the document is saved
  }
);

// ── Export the model ──────────────────────────────────────────
// mongoose.model('Profile', ProfileSchema) does two things:
//   1. Creates a model class called "Profile"
//   2. Maps it to the MongoDB collection called "profiles" (auto-pluralised + lowercased)
module.exports = mongoose.model('Profile', ProfileSchema);
