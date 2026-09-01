/**
 * ============================================================
 *  models/Project.js — The Project Mongoose Model
 * ============================================================
 *
 * Each document in the "projects" MongoDB collection represents
 * one project card shown on the portfolio website.
 *
 * You can add as many projects as you want — unlike Profile,
 * this collection holds multiple documents.
 */

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true },
    description:     { type: String, required: true }, // Short card description
    longDescription: { type: String },                 // Optional detailed description
    techStack:       [{ type: String }],               // Array of strings e.g. ['React','Node.js']
    githubUrl:       { type: String },
    liveUrl:         { type: String },
    imageUrl:        { type: String },
    featured:        { type: Boolean, default: false }, // If true, shown with ⭐ badge
    status: {
      type: String,
      // enum restricts the value to only these 3 options.
      // Mongoose will throw a validation error if you try to save anything else.
      enum: ['completed', 'in-progress', 'archived'],
      default: 'completed',
    },
    order:     { type: Number, default: 0 }, // Lower number = shown first (for manual sorting)
    startDate: { type: Date },
    endDate:   { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
