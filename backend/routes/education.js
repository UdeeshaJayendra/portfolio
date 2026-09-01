/**
 * ============================================================
 *  routes/education.js — CRUD API for Education
 * ============================================================
 * GET    /api/education      → public (anyone can read)
 * POST   /api/education      → admin only
 * PUT    /api/education/:id  → admin only
 * DELETE /api/education/:id  → admin only
 */

const router = require('express').Router();
const Education = require('../models/Education');
const { auth, adminOnly } = require('../middleware/auth');

// PUBLIC — list all, sorted by order then newest
router.get('/', async (req, res) => {
  try {
    const items = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN — create new entry
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const item = await new Education(req.body).save();
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ADMIN — update existing entry by id
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ADMIN — delete entry by id
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const item = await Education.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
