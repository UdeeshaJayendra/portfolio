/**
 * ============================================================
 *  models/Education.js — The Education Mongoose Model
 * ============================================================
 *
 * Represents academic qualifications shown in the Education section.
 */

const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true }, // University/school name
    degree:      { type: String, required: true }, // e.g. 'Bachelor of Science'
    field:       { type: String, required: true }, // e.g. 'Computer Science'
    startDate:   { type: Date, required: true },
    endDate:     { type: Date },
    current:     { type: Boolean, default: false }, // true = still studying
    gpa:         { type: String },                  // Stored as String to allow '3.8/4.0' format
    description: { type: String },
    achievements: [{ type: String }],               // e.g. ["Dean's List 2023", "Won Hackathon"]
    order:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', EducationSchema);
