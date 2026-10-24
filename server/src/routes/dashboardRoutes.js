const express = require('express');
const router = express.Router();
const { getStats, getActivity } = require('../controllers/dashboardController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/stats', authenticate, authorize('admin'), getStats);
router.get('/activity', authenticate, authorize('admin'), getActivity);

module.exports = router;
