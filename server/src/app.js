const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const userRoutes = require('./routes/userRoutes');
const progressRoutes = require('./routes/progressRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,           // allow cookies to be sent cross-origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// ── Body parsing & cookies ──────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'ok' : 'degraded',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

// ── Database readiness guard for API routes ────────────────────────────────
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database service is currently unavailable. Please check MongoDB Atlas connection and IP whitelist.',
    });
  }
  next();
};

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', checkDbConnection, authRoutes);
app.use('/api/roadmaps', checkDbConnection, roadmapRoutes);
app.use('/api/users', checkDbConnection, userRoutes);
app.use('/api/progress', checkDbConnection, progressRoutes);
app.use('/api/dashboard', checkDbConnection, dashboardRoutes);

// ── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// ── Central error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;
