require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const Question = require('./models/Question');
const Participant = require('./models/Participant');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

/**
 * API ROUTES
 */

// ============================================
// 1. START QUIZ - Initialize participant session
// ============================================
app.post('/api/start-quiz', async (req, res) => {
  try {
    const { name } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name must be at least 2 characters long' 
      });
    }

    // Generate unique session ID (timestamp + random)
    const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create new participant
    const participant = await Participant.create({
      name: name.trim(),
      sessionId,
      quizStartTime: new Date()
    });

    console.log(`✅ Quiz started for: ${name} (Session: ${sessionId})`);

    res.status(201).json({
      success: true,
      message: 'Quiz started successfully',
      data: {
        sessionId: participant.sessionId,
        name: participant.name,
        startTime: participant.quizStartTime
      }
    });

  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to start quiz. Please try again.' 
    });
  }
});

// ============================================
// 2. GET QUESTIONS - Fetch all quiz questions
// ============================================
app.get('/api/questions', async (req, res) => {
  try {
    const { sessionId } = req.query;

    // Verify session exists
    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID required' 
      });
    }

    const participant = await Participant.findOne({ sessionId });
    if (!participant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid session' 
      });
    }

    // Check if already submitted
    if (participant.isSubmitted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz already submitted' 
      });
    }

    // Fetch all questions (exclude correctAnswer for security)
    const questions = await Question.find({})
      .select('-correctAnswer')
      .sort({ questionNumber: 1 });

    res.json({
      success: true,
      data: {
        questions: questions.map(q => ({
          id: q._id,
          questionNumber: q.questionNumber,
          question: q.question,
          options: q.options,
          category: q.category
        })),
        totalQuestions: questions.length
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch questions' 
    });
  }
});

// ============================================
// 3. SAVE ANSWERS - Save user's answers (auto-save)
// ============================================
app.post('/api/save-answers', async (req, res) => {
  try {
    const { sessionId, answers } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID required' 
      });
    }

    const participant = await Participant.findOne({ sessionId });
    if (!participant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid session' 
      });
    }

    // Check if already submitted
    if (participant.isSubmitted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz already submitted' 
      });
    }

    // Update answers (merge with existing)
    participant.answers = new Map([...participant.answers, ...Object.entries(answers)]);
    await participant.save();

    res.json({
      success: true,
      message: 'Answers saved',
      savedCount: participant.answers.size
    });

  } catch (error) {
    console.error('Error saving answers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save answers' 
    });
  }
});

// ============================================
// 4. SELECT BONUS TIME - Apply bonus time penalty
// ============================================
app.post('/api/select-bonus', async (req, res) => {
  try {
    const { sessionId, bonusMinutes } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID required' 
      });
    }

    // Validate bonus minutes
    const validBonusOptions = {
      15: -3,
      20: -5,
      30: -8
    };

    if (!validBonusOptions[bonusMinutes]) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid bonus time selection' 
      });
    }

    const participant = await Participant.findOne({ sessionId });
    if (!participant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid session' 
      });
    }

    // Check if bonus already selected
    if (participant.baseBonusSelected) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bonus time already selected' 
      });
    }

    // Check if already submitted
    if (participant.isSubmitted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz already submitted' 
      });
    }

    // Apply bonus
    participant.baseBonusSelected = true;
    participant.bonusTimeSelected = bonusMinutes;
    participant.bonusPenalty = validBonusOptions[bonusMinutes];
    await participant.save();

    console.log(`⏰ Bonus applied: ${bonusMinutes} min (Penalty: ${validBonusOptions[bonusMinutes]}) for ${participant.name}`);

    res.json({
      success: true,
      message: 'Bonus time applied',
      data: {
        bonusMinutes: bonusMinutes,
        penalty: validBonusOptions[bonusMinutes]
      }
    });

  } catch (error) {
    console.error('Error selecting bonus:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to apply bonus time' 
    });
  }
});

// ============================================
// 5. SUBMIT QUIZ - Calculate final score
// ============================================
app.post('/api/submit-quiz', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID required' 
      });
    }

    const participant = await Participant.findOne({ sessionId });
    if (!participant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid session' 
      });
    }

    // Prevent double submission
    if (participant.isSubmitted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz already submitted' 
      });
    }

    // Mark submission time
    participant.quizEndTime = new Date();
    participant.isSubmitted = true;

    // Calculate results on server (SECURE)
    const results = await participant.calculateResults();
    await participant.save();

    console.log(`✅ Quiz submitted by ${participant.name}:`);
    console.log(`   Correct: ${results.totalCorrect}/500`);
    console.log(`   Score: ${results.totalScore}`);
    console.log(`   Time: ${results.totalTimeSpent}s`);

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        name: participant.name,
        totalCorrect: results.totalCorrect,
        totalQuestions: 500,
        totalScore: results.totalScore,
        bonusTimeUsed: participant.bonusTimeSelected,
        bonusPenalty: participant.bonusPenalty,
        totalTimeSpent: results.totalTimeSpent,
        averageTimePerQuestion: results.averageTimePerQuestion,
        submittedAt: participant.submittedAt || participant.quizEndTime
      }
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit quiz' 
    });
  }
});

// ============================================
// 6. GET SESSION STATUS - Check if session is valid
// ============================================
app.get('/api/session-status', async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID required' 
      });
    }

    const participant = await Participant.findOne({ sessionId });
    if (!participant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    res.json({
      success: true,
      data: {
        isSubmitted: participant.isSubmitted,
        bonusSelected: participant.baseBonusSelected,
        startTime: participant.quizStartTime,
        answeredCount: participant.answers.size
      }
    });

  } catch (error) {
    console.error('Error fetching session status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch session status' 
    });
  }
});

// ============================================
// 7. ADMIN AUTHENTICATION - Check if admin access
// ============================================
app.post('/api/admin/authenticate', async (req, res) => {
  try {
    const { name } = req.body;

    // STRICT: Only "sam altman" (case-sensitive) gets admin access
    if (name === 'sam altman') {
      // Generate admin token (simple sessionId for this implementation)
      const adminToken = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('✅ Admin access granted');
      
      res.json({
        success: true,
        message: 'Admin authenticated',
        data: {
          adminToken,
          isAdmin: true
        }
      });
    } else {
      // Not admin - treat as regular participant
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Invalid credentials.',
        isAdmin: false
      });
    }

  } catch (error) {
    console.error('Error in admin auth:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
});

// ============================================
// 8. ADMIN PANEL - Get all participants data
// ============================================
app.get('/api/admin/participants', async (req, res) => {
  try {
    const { adminToken, sortBy } = req.query;

    // Basic admin token verification (in production, use JWT)
    if (!adminToken || !adminToken.startsWith('admin-')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden. Admin access required.' 
      });
    }

    // Fetch all submitted participants
    let query = Participant.find({ isSubmitted: true })
      .select('name totalScore totalCorrect bonusTimeSelected bonusPenalty totalTimeSpent averageTimePerQuestion submittedAt');

    // Apply sorting
    if (sortBy === 'score') {
      query = query.sort({ totalScore: -1, totalTimeSpent: 1 }); // Highest score, then fastest
    } else if (sortBy === 'speed') {
      query = query.sort({ averageTimePerQuestion: 1 }); // Fastest speed
    } else {
      query = query.sort({ submittedAt: -1 }); // Most recent first
    }

    const participants = await query;

    console.log(`📊 Admin accessed leaderboard: ${participants.length} participants`);

    res.json({
      success: true,
      data: {
        participants: participants.map((p, index) => ({
          rank: index + 1,
          name: p.name,
          totalScore: p.totalScore,
          totalCorrect: p.totalCorrect,
          bonusTimeUsed: p.bonusTimeSelected,
          bonusPenalty: p.bonusPenalty,
          totalTimeSpent: p.totalTimeSpent,
          averageSpeed: p.averageTimePerQuestion,
          submittedAt: p.submittedAt
        })),
        total: participants.length
      }
    });

  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch participants data' 
    });
  }
});

// ============================================
// ADMIN: Seed Database Endpoint
// ============================================
app.post('/api/admin/seed', async (req, res) => {
  try {
    console.log('🌱 Starting database seed via API...');
    
    // Import Question model (already imported at top)
    // const Question = require('./models/Question');
    
    // Clear existing questions
    const deletedCount = await Question.deleteMany({});
    console.log(`🗑️ Cleared ${deletedCount.deletedCount || 0} existing questions`);

    // Generate questions using the existing function
    const backtraceQuestions = [
      { q: "Room Light Automation: Person enters room → Light turns ON, Person leaves room → Light turns OFF. Which components are needed?", opts: ["Motion Sensor, Controller, Light", "Temperature Sensor, Controller, Light", "Motion Sensor, Speaker, Light", "Camera, Controller, Light"], ans: 0 },
      { q: "Automatic Hand Sanitizer: Hand placed → Sanitizer dispensed. Which components are needed?", opts: ["IR Sensor, Pump Motor, Controller", "Motion Sensor, Pump Motor, Controller", "IR Sensor, Display Screen, Controller", "Camera, Pump Motor, Controller"], ans: 0 },
      { q: "Mobile Phone Unlock (PIN): Enter PIN → Phone unlocks. Which components are needed?", opts: ["Keypad, Authentication Logic, Display, Storage", "Keypad, Speaker, Display, Storage", "Camera, Authentication Logic, Display, Storage", "Keypad, Authentication Logic, Speaker, Storage"], ans: 0 },
      { q: "Lift System: Press floor button → Lift moves → Door opens. Which components are needed?", opts: ["Button Panel, Motor, Controller, Door Mechanism", "Button Panel, Speaker, Controller, Door Mechanism", "Camera, Motor, Controller, Door Mechanism", "Button Panel, Motor, Display, Door Mechanism"], ans: 0 },
      { q: "Online Login System: Enter credentials → Login success/failure. Which components are needed?", opts: ["Input Form, Database, Authentication Logic, Display", "Input Form, Printer, Authentication Logic, Display", "Input Form, Database, Speaker, Display", "Camera, Database, Authentication Logic, Display"], ans: 0 },
      { q: "Traffic Signal: Red → Yellow → Green → Red. Which components are needed?", opts: ["Timer, Controller, Signal Lights, Power Supply", "Timer, Camera, Signal Lights, Power Supply", "Timer, Controller, Display, Power Supply", "Motion Sensor, Controller, Signal Lights, Power Supply"], ans: 0 },
      { q: "Smart Door Lock: Fingerprint scanned → Door unlocks. Which components are needed?", opts: ["Fingerprint Sensor, Controller, Lock Motor", "Fingerprint Sensor, Display, Lock Motor", "Temperature Sensor, Controller, Lock Motor", "Fingerprint Sensor, Controller, Speaker"], ans: 0 },
      { q: "ATM Withdrawal: Insert card → Enter PIN → Cash dispensed. Which components are needed?", opts: ["Card Reader, Keypad, Bank Server, Cash Dispenser", "Card Reader, Keypad, Bank Server, Speaker", "Card Reader, Display, Bank Server, Cash Dispenser", "Camera, Keypad, Bank Server, Cash Dispenser"], ans: 0 },
      { q: "Automatic Street Light: Night → Light ON, Day → Light OFF. Which components are needed?", opts: ["LDR Sensor, Controller, Light, Power Unit", "Motion Sensor, Controller, Light, Power Unit", "LDR Sensor, Display, Light, Power Unit", "LDR Sensor, Controller, Camera, Power Unit"], ans: 0 },
      { q: "File Upload System: Click Upload → Progress bar → Success. Which components are needed?", opts: ["UI Button, Backend Server, Storage, Progress Indicator", "UI Button, Backend Server, Camera, Progress Indicator", "UI Button, Printer, Storage, Progress Indicator", "Display, Backend Server, Storage, Progress Indicator"], ans: 0 },
    ];

    const questionsToInsert = [];
    
    // Generate 500 questions
    for (let i = 0; i < 500; i++) {
      const base = backtraceQuestions[i % backtraceQuestions.length];
      let difficulty;
      if (i < 150) difficulty = 'easy';
      else if (i < 300) difficulty = 'medium';
      else difficulty = 'hard';
      
      questionsToInsert.push({
        questionNumber: i + 1,
        question: base.q + ` (Q${i+1})`,
        options: base.opts,
        correctAnswer: base.ans,
        category: 'general',
        difficulty: difficulty
      });
    }

    console.log(`📝 Generated ${questionsToInsert.length} questions`);

    // Insert all questions
    const result = await Question.insertMany(questionsToInsert);
    console.log(`✅ Inserted ${result.length} questions`);

    // Verify count
    const finalCount = await Question.countDocuments();
    console.log(`📊 Total questions in database: ${finalCount}`);

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        questionsSeeded: finalCount,
        breakdown: {
          easy: questionsToInsert.filter(q => q.difficulty === 'easy').length,
          medium: questionsToInsert.filter(q => q.difficulty === 'medium').length,
          hard: questionsToInsert.filter(q => q.difficulty === 'hard').length
        }
      }
    });

  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backtrace Quiz API is running',
    timestamp: new Date()
  });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   Backtrace Quiz Server Running`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('   ========================================\n');
});
