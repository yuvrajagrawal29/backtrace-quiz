const mongoose = require('mongoose');

/**
 * Question Schema
 * Stores all 500 MCQ questions with 4 options each
 * correctAnswer is stored as index (0-3) for security
 */
const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 500
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length === 4;
      },
      message: 'Each question must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  category: {
    type: String,
    enum: ['aptitude', 'logic', 'cs-basics', 'puzzles', 'general'],
    default: 'general'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for faster queries
questionSchema.index({ questionNumber: 1 });

module.exports = mongoose.model('Question', questionSchema);
