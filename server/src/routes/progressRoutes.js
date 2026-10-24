const express = require('express');
const router = express.Router();
const { getMyProgress, getProgressForRoadmap, updateProgress } = require('../controllers/progressController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, getMyProgress);
router.get('/:roadmapId', authenticate, getProgressForRoadmap);
router.put('/:roadmapId', authenticate, updateProgress);

module.exports = router;
