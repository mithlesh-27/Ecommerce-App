const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

/* ---------------- REGISTER ---------------- */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  try {
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0)
      return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1,$2,$3)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------------- LOGIN ---------------- */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'All fields required' });

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------------- GET CURRENT USER ---------------- */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(user.rows[0]);
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
/* ---------------- GET ADDRESSES ---------------- */
router.get('/addresses', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT addresses FROM users WHERE id = $1',
      [req.user.id]
    );

    const addresses = result.rows[0]?.addresses || [];

    res.json(addresses);
  } catch (err) {
    console.error('Get addresses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


/* ---------------- UPDATE ADDRESSES ---------------- */
router.put('/addresses', auth, async (req, res) => {
  const { addresses } = req.body;

  try {
    await pool.query(
      'UPDATE users SET addresses = $1 WHERE id = $2',
      [JSON.stringify(addresses), req.user.id]
    );

    res.json({ message: 'Addresses updated successfully' });
  } catch (err) {
    console.error('Update addresses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------------- CHANGE PASSWORD ---------------- */
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: 'All fields are required' });

  if (newPassword.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  try {
    const result = await pool.query(
      'SELECT id, password FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------------- NODEMAILER CONFIG ---------------- */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ---------------- FORGOT PASSWORD ---------------- */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: 'Email is required' });

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Email not found' });

    const token = crypto.randomBytes(32).toString('hex');

    // ✅ FIXED: Use proper Date object for TIMESTAMP column
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [token, expires, email]
    );

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    res.json({ message: 'Reset password email sent' });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------------- RESET PASSWORD ---------------- */
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const result = await pool.query(
      'SELECT id, reset_token_expiry FROM users WHERE reset_token = $1',
      [token]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: 'Invalid token' });

    const user = result.rows[0];

    // ✅ FIXED: Proper timestamp comparison
    if (new Date() > user.reset_token_expiry)
      return res.status(400).json({ message: 'Token expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Password updated successfully' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;