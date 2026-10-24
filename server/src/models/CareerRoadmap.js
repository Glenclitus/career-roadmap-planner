const mongoose = require('mongoose');
const slugify = require('slugify');

// Sub-document: a single resource link
const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

// Sub-document: a single task inside a stage
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: true } // keep _id so users can reference completed tasks
);

// Sub-document: a learning stage
const stageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, required: true },
    tasks: [taskSchema],
    resources: [resourceSchema],
  },
  { _id: true }
);

const careerRoadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Software Development',
        'Data Science',
        'Data Analytics',
        'Full-Stack Development',
        'Cybersecurity',
        'Cloud Engineering',
        'AI/ML',
        'Other',
      ],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    estimatedDuration: {
      type: String,
      required: true, // e.g., "6 months"
    },
    prerequisites: [{ type: String }],
    skills: [{ type: String }],
    learningStages: [stageSchema],
    projectSuggestions: [{ type: String }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title before saving
careerRoadmapSchema.pre('save', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

careerRoadmapSchema.index({ category: 1, difficulty: 1 });
careerRoadmapSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('CareerRoadmap', careerRoadmapSchema);
