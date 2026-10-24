const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Helper: generate JWT and set it as an HttpOnly cookie
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,             // HTTPS only in production
    sameSite: isProd ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// Helper: extract validation errors
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    return false;
  }
  return true;
};

// POST /api/auth/register
const register = async (req, res) => {
  if (!validate(req, res)) return;

  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Public registration ALWAYS creates a normal user
    const user = await User.create({ name, email, passwordHash, role: 'user' });

    sendTokenCookie(res, user._id);

    return res.status(201).json({
      message: 'Registration successful.',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  if (!validate(req, res)) return;

  try {
    const { email, password } = req.body;

    // passwordHash is select:false — must explicitly request it
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    sendTokenCookie(res, user._id);

    return res.status(200).json({
      message: 'Login successful.',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'Lax' });
  return res.status(200).json({ message: 'Logged out successfully.' });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  // req.user is already attached by authenticate middleware
  return res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// PATCH /api/auth/change-password
const changePassword = async (req, res) => {
  if (!validate(req, res)) return;

  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    // Clear existing token so user must log in again
    res.clearCookie('token', { httpOnly: true, sameSite: 'Lax' });

    return res.status(200).json({ message: 'Password changed successfully. Please log in again.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, logout, getMe, changePassword };
