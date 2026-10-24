const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CareerRoadmap',
      required: true,
    },
    // Array of task _id strings that the user has marked complete
    completedTaskIds: [{ type: String }],
  },
  { timestamps: true }
);

// Each user can have only one progress record per roadmap
userProgressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
