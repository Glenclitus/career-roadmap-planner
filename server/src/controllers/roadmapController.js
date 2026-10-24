const { validationResult } = require('express-validator');
const CareerRoadmap = require('../models/CareerRoadmap');

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    return false;
  }
  return true;
};

// GET /api/roadmaps
const getRoadmaps = async (req, res) => {
  try {
    const { search, category, difficulty, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await CareerRoadmap.countDocuments(query);
    const roadmaps = await CareerRoadmap.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      roadmaps,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/roadmaps/:id
const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await CareerRoadmap.findById(req.params.id).populate('createdBy', 'name email');
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
    return res.status(200).json({ roadmap });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/roadmaps  (admin only)
const createRoadmap = async (req, res) => {
  if (!validate(req, res)) return;

  try {
    const roadmap = await CareerRoadmap.create({ ...req.body, createdBy: req.user._id });
    return res.status(201).json({ message: 'Roadmap created successfully.', roadmap });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A roadmap with this title already exists.' });
    }
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/roadmaps/:id  (admin only)
const updateRoadmap = async (req, res) => {
  if (!validate(req, res)) return;

  try {
    const roadmap = await CareerRoadmap.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
    return res.status(200).json({ message: 'Roadmap updated successfully.', roadmap });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/roadmaps/:id  (admin only)
const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await CareerRoadmap.findByIdAndDelete(req.params.id);
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found.' });
    return res.status(200).json({ message: 'Roadmap deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getRoadmaps, getRoadmapById, createRoadmap, updateRoadmap, deleteRoadmap };
