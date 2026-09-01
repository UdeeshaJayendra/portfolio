/**
 * ============================================================
 *  routes/experience.js — CRUD API for Experience
 * ============================================================
 * GET    /api/experience      → public (anyone can read)
 * POST   /api/experience      → admin only
 * PUT    /api/experience/:id  → admin only
 * DELETE /api/experience/:id  → admin only
 */

const router = require('express').Router();
const Experience = require('../models/Experience');
const { auth, adminOnly } = require('../middleware/auth');

// PUBLIC — list all, sorted by order then newest
router.get('/', async (req, res) => {
  try {
    const items = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN — create new entry
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const item = await new Experience(req.body).save();
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ADMIN — update existing entry by id
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ADMIN — delete entry by id
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
