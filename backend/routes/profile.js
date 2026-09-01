/**
 * ============================================================
 *  routes/profile.js — Profile API
 * ============================================================
 * GET  /api/profile  → public  (show your info to visitors)
 * POST /api/profile  → admin only (update your info)
 *
 * There is only ever ONE profile document. We use findOne()
 * to get it and upsert (update-or-insert) to save it.
 */

const router  = require('express').Router();
const Profile = require('../models/Profile');
const { auth, adminOnly } = require('../middleware/auth');

// PUBLIC — get your profile info
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN — create or update profile (upsert pattern)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      // Profile exists → update it. { new: true } returns the updated version.
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, { new: true, runValidators: true });
    } else {
      // No profile yet → create it
      profile = await new Profile(req.body).save();
    }
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
