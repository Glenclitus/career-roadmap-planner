const { body } = require('express-validator');

const roadmapValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('difficulty')
    .notEmpty()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
  body('estimatedDuration').trim().notEmpty().withMessage('Estimated duration is required'),
];

module.exports = { roadmapValidator };
