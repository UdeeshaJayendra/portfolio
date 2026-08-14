/**
 * ============================================================
 *  routes/projects.js — CRUD API for Projects
 * ============================================================
 *
 * What is a Router?
 *   express.Router() creates a mini Express app for one resource.
 *   server.js mounts it at '/api/projects', so:
 *     GET  /api/projects        → router.get('/')
 *     POST /api/projects        → router.post('/')
 *     PUT  /api/projects/:id    → router.put('/:id')
 *     DELETE /api/projects/:id  → router.delete('/:id')
 *
 * Auth Rules:
 *   GET  — public  (anyone can view projects)
 *   POST/PUT/DELETE — admin only (protected by auth middleware)
 */

const router  = require('express').Router();
const Project = require('../models/Project');
const { auth, adminOnly } = require('../middleware/auth');

// ── GET /api/projects ─────────────────────────────────────────
// Returns all projects sorted by 'order' then newest first.
// PUBLIC — no login required.
router.get('/', async (req, res) => {
  try {
    const items = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/projects ────────────────────────────────────────
// Creates a new project document in MongoDB.
// ADMIN ONLY — requires valid JWT token with admin role.
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    // req.body contains the JSON sent from the frontend form
    const item = await new Project(req.body).save();
    res.status(201).json(item); // 201 = Created
  } catch (err) {
    res.status(400).json({ error: err.message }); // 400 = Bad Request (e.g. missing required field)
  }
});

// ── PUT /api/projects/:id ─────────────────────────────────────
// Updates an existing project by its MongoDB _id.
// :id is a URL parameter — e.g. /api/projects/64abc123...
// ADMIN ONLY
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const item = await Project.findByIdAndUpdate(
      req.params.id, // The _id from the URL
      req.body,      // Fields to update
      { new: true }  // Return the UPDATED document (not the old one)
    );
    if (!item) return res.status(404).json({ error: 'Project not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── DELETE /api/projects/:id ──────────────────────────────────
// Permanently deletes a project by its MongoDB _id.
// ADMIN ONLY
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const item = await Project.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
