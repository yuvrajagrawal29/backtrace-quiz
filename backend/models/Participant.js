const mongoose = require('mongoose');

/**
 * Participant Schema
 * Stores participant data, answers, and calculated results
 * Security: sessionId prevents multiple attempts
 */
const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Quiz state tracking
  quizStartTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  quizEndTime: {
    type: Date
  },
  answers: {
    type: Map,
    of: Number, // Key: questionNumber, Value: selectedOption (0-3)
    default: new Map()
  },
  // Bonus time tracking
  baseBonusSelected: {
    type: Boolean,
    default: false
  },
  bonusTimeSelected: {
    type: Number,
    enum: [0, 15, 20, 30],
    default: 0
  },
  bonusPenalty: {
    type: Number,
    default: 0
  },
  // Results (calculated on server)
  totalCorrect: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  averageTimePerQuestion: {
    type: Number, // in seconds
    default: 0
  },
  // Status
  isSubmitted: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Prevent duplicate sessions
participantSchema.index({ sessionId: 1 }, { unique: true });

// Method to calculate results
participantSchema.methods.calculateResults = async function() {
  const Question = mongoose.model('Question');
  
  let correctCount = 0;
  const answersMap = this.answers;
  
  // Fetch all questions to verify answers
  const questions = await Question.find({});
  
  for (let question of questions) {
    const userAnswer = answersMap.get(question.questionNumber.toString());
    if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
      correctCount++;
    }
  }
  
  // Calculate base score
  let baseScore = correctCount;
  
  // Apply bonus penalty
  let finalScore = baseScore - this.bonusPenalty;
  
  // Ensure score doesn't go negative
  finalScore = Math.max(0, finalScore);
  
  // Calculate time metrics
  const timeSpentMs = this.quizEndTime - this.quizStartTime;
  const timeSpentSeconds = Math.floor(timeSpentMs / 1000);
  
  const questionsAttempted = answersMap.size;
  const avgTime = questionsAttempted > 0 
    ? (timeSpentSeconds / questionsAttempted).toFixed(2) 
    : 0;
  
  this.totalCorrect = correctCount;
  this.totalScore = finalScore;
  this.totalTimeSpent = timeSpentSeconds;
  this.averageTimePerQuestion = parseFloat(avgTime);
  
  return {
    totalCorrect: correctCount,
    totalScore: finalScore,
    totalTimeSpent: timeSpentSeconds,
    averageTimePerQuestion: parseFloat(avgTime)
  };
};

module.exports = mongoose.model('Participant', participantSchema);
