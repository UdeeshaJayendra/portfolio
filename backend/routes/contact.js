/**
 * ============================================================
 *  routes/contact.js — Contact Form API
 * ============================================================
 * POST /api/contact → public (anyone can send a message)
 *
 * In production you'd send an email here using nodemailer.
 * For now it validates the input and logs it to the console.
 */

const router = require('express').Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic server-side validation (never trust only frontend validation)
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // TODO: In production, replace this with nodemailer to send a real email:
  // const transporter = nodemailer.createTransport({ service: 'gmail', auth: {...} });
  // await transporter.sendMail({ from: email, to: 'you@gmail.com', subject, text: message });

  console.log('📧 New contact message:', { name, email, subject, message });
  res.json({ success: true, message: 'Message received! I will get back to you soon.' });
});

module.exports = router;
