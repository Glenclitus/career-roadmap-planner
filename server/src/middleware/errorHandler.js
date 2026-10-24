/**
 * Central error handler — always returns JSON.
 * Add this as the LAST middleware in app.js.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose duplicate key (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already exists.` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  // Default
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message;

  res.status(status).json({ message });
};

module.exports = errorHandler;
