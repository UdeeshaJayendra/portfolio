/**
 * ============================================================
 *  models/Experience.js — The Experience Mongoose Model
 * ============================================================
 *
 * Represents work experience entries shown in the timeline.
 * Each document = one job/internship/freelance role.
 */

const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema(
  {
    company:  { type: String, required: true },
    role:     { type: String, required: true }, // Your job title
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
      default: 'full-time',
    },
    location:    { type: String },
    startDate:   { type: Date, required: true },
    endDate:     { type: Date },                     // Leave null/undefined if current: true
    current:     { type: Boolean, default: false },  // If true, shows "Present" instead of endDate
    description: { type: String },                   // One-paragraph overview
    highlights:  [{ type: String }],                 // Bullet point achievements (array of strings)
    techUsed:    [{ type: String }],                 // Technologies you used there
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', ExperienceSchema);
