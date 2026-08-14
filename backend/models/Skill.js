/**
 * ============================================================
 *  models/Skill.js — The Skill Mongoose Model
 * ============================================================
 *
 * Each document represents one skill with a proficiency level.
 * Skills are grouped by category in the frontend to create
 * the categorised skill bars section.
 */

const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true }, // e.g. 'React'
    category: {
      type: String,
      required: true,
      // These are the only valid categories. The frontend filters by these exact strings.
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'],
    },
    proficiency: {
      type: Number,
      min: 0,   // Cannot be below 0
      max: 100, // Cannot be above 100
      default: 80,
    },
    icon:  { type: String }, // Optional icon name or URL
    order: { type: Number, default: 0 }, // Controls display order within a category
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', SkillSchema);
