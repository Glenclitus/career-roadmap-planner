const UserProgress = require('../models/UserProgress');
const CareerRoadmap = require('../models/CareerRoadmap');

// GET /api/progress  — all progress for the current user
const getMyProgress = async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.user._id }).populate(
      'roadmapId',
      'title slug category difficulty learningStages'
    );
    return res.status(200).json({ progress });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/progress/:roadmapId  — progress for one roadmap
const getProgressForRoadmap = async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      userId: req.user._id,
      roadmapId: req.params.roadmapId,
    });

    if (!progress) {
      // Return an empty record rather than 404 so the UI can display 0%
      return res.status(200).json({ progress: { completedTaskIds: [] } });
    }
    return res.status(200).json({ progress });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/progress/:roadmapId  — upsert progress
const updateProgress = async (req, res) => {
  try {
    const { completedTaskIds } = req.body;

    if (!Array.isArray(completedTaskIds)) {
      return res.status(400).json({ message: 'completedTaskIds must be an array.' });
    }

    // Verify roadmap exists
    const roadmap = await CareerRoadmap.findById(req.params.roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }

    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.user._id, roadmapId: req.params.roadmapId },
      { completedTaskIds },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Progress updated.', progress });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyProgress, getProgressForRoadmap, updateProgress };
