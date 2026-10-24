const User = require('../models/User');
const CareerRoadmap = require('../models/CareerRoadmap');
const UserProgress = require('../models/UserProgress');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalRoadmaps, totalProgressRecords, recentRoadmaps] = await Promise.all([
      User.countDocuments(),
      CareerRoadmap.countDocuments(),
      UserProgress.countDocuments(),
      CareerRoadmap.find().sort({ createdAt: -1 }).limit(5).select('title category difficulty createdAt'),
    ]);

    return res.status(200).json({
      stats: { totalUsers, totalRoadmaps, totalProgressRecords },
      recentRoadmaps,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/activity
const getActivity = async (req, res) => {
  try {
    const recentUsers = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentRoadmaps = await CareerRoadmap.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title category updatedAt');

    return res.status(200).json({ recentUsers, recentRoadmaps });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getActivity };
