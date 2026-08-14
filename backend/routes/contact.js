const router     = require('express').Router();
const nodemailer = require('nodemailer');

const hasEmailConfig = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);

const transporter = hasEmailConfig
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null;

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  console.log('📧 New contact message:', { name, email, subject, message });

  if (!hasEmailConfig) {
    console.warn('⚠️  GMAIL_USER / GMAIL_APP_PASSWORD not set — email NOT sent, only logged above.');
    return res.json({ success: true, message: 'Message received! I will get back to you soon.' });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `[Portfolio] ${subject || 'New message from ' + name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject || '(none)'}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    });
    res.json({ success: true, message: 'Message received! I will get back to you soon.' });
  } catch (err) {
    console.error('❌ Failed to send contact email:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again or email me directly.' });
  }
});

module.exports = router;