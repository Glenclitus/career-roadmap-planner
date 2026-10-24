const express = require('express');
const router = express.Router();
const {
  getRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} = require('../controllers/roadmapController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { roadmapValidator } = require('../validators/roadmapValidators');

// Any authenticated user can read roadmaps
router.get('/', authenticate, getRoadmaps);
router.get('/:id', authenticate, getRoadmapById);

// Admin-only write operations
router.post('/', authenticate, authorize('admin'), roadmapValidator, createRoadmap);
router.put('/:id', authenticate, authorize('admin'), roadmapValidator, updateRoadmap);
router.delete('/:id', authenticate, authorize('admin'), deleteRoadmap);

module.exports = router;
