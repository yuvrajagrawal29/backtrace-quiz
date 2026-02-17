# 🎯 BACKTRACE - Round 1 | Quiz Competition Platform

A complete, production-ready full-stack web application for conducting timed competitive quizzes for college fest events.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Quiz Rules](#quiz-rules)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Deployment](#deployment)

---

## ✨ Features

### Core Features
- ✅ **500 MCQ Questions** - Pre-loaded with diverse questions
- ⏱️ **Timed Quiz** - 30-minute base time with bonus options
- 🎁 **Bonus Time System** - Optional time extensions with penalties
- 📊 **Real-time Progress** - Live tracking of answered questions
- 💾 **Auto-save** - Answers saved every 10 seconds
- 🔒 **Anti-cheat** - Prevents refresh, multiple attempts
- 📈 **Detailed Results** - Comprehensive score breakdown
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS

### Bonus Time Options
- **+15 minutes** → -3 points penalty
- **+20 minutes** → -5 points penalty
- **+30 minutes** → -8 points penalty

### Scoring System
- **+1 point** for each correct answer
- **No negative marking** for wrong answers
- **Bonus penalty** deducted from final score
- **Speed tracking** - Average time per question calculated

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (v18.2) - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM library

---

## 📁 Project Structure

```
backtrace-quiz/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Question.js           # Question schema
│   │   └── Participant.js        # Participant schema
│   ├── server.js                 # Express server + API routes
│   ├── seedQuestions.js          # Database seeder (500 questions)
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Timer.jsx         # Timer component with bonus logic
    │   ├── pages/
    │   │   ├── LandingPage.jsx   # Entry page (name input)
    │   │   ├── QuizPage.jsx      # Main quiz interface
    │   │   └── ResultsPage.jsx   # Results display
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Global styles
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## 📦 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

---

## 🚀 Installation

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd backtrace-quiz
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB connection
# MONGODB_URI=mongodb://localhost:27017/backtrace-quiz
# PORT=5000
# CORS_ORIGIN=http://localhost:5173
```

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file
# VITE_API_URL=http://localhost:5000/api
```

### 4️⃣ Seed Database with 500 Questions

```bash
# From backend directory
cd ../backend

# Run the seeder
npm run seed
```

**Expected Output:**
```
🌱 Starting database seed...
✅ Connected to MongoDB
🗑️  Cleared existing questions
📝 Generated 500 questions
✅ Successfully seeded 500 questions!
📊 Total questions in database: 500

📈 Breakdown by category:
   aptitude: 100 questions
   logic: 100 questions
   cs-basics: 150 questions
   puzzles: 100 questions
   general: 50 questions
```

---

## 🏃 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Application will open on `http://localhost:5173`

### Option 2: Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 📖 Quiz Rules

### Participant Flow
1. **Enter Name** - Minimum 2 characters required
2. **Start Quiz** - Timer starts immediately
3. **Answer Questions** - Navigate through 500 MCQs
4. **Submit** - Either manually or auto-submit on timeout

### Time Management
- **Base Time:** 30 minutes
- **After 30 minutes:** Bonus time modal appears
- **Bonus Options:**
  - Select +15, +20, or +30 minutes (with penalty)
  - OR Submit immediately (no penalty)
- **Bonus Selection:** Can only be selected ONCE

### Anti-Cheat Measures
- ✅ Session-based tracking prevents multiple attempts
- ✅ Page refresh attempts are blocked
- ✅ Scoring calculated server-side (not client-side)
- ✅ Answers auto-saved to prevent data loss

### Scoring Rules
```
Final Score = (Correct Answers × 1) - Bonus Penalty

Example 1:
- Correct: 350
- Bonus: None
- Final Score: 350

Example 2:
- Correct: 400
- Bonus: +15 min (-3)
- Final Score: 397
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Start Quiz
```http
POST /api/start-quiz
Content-Type: application/json

{
  "name": "John Doe"
}

Response:
{
  "success": true,
  "message": "Quiz started successfully",
  "data": {
    "sessionId": "1234567890-abc123",
    "name": "John Doe",
    "startTime": "2024-01-15T10:00:00.000Z"
  }
}
```

#### 2. Get Questions
```http
GET /api/questions?sessionId=1234567890-abc123

Response:
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "...",
        "questionNumber": 1,
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "category": "aptitude"
      },
      ...
    ],
    "totalQuestions": 500
  }
}
```

#### 3. Save Answers (Auto-save)
```http
POST /api/save-answers
Content-Type: application/json

{
  "sessionId": "1234567890-abc123",
  "answers": {
    "1": 1,
    "2": 0,
    "3": 3
  }
}

Response:
{
  "success": true,
  "message": "Answers saved",
  "savedCount": 3
}
```

#### 4. Select Bonus Time
```http
POST /api/select-bonus
Content-Type: application/json

{
  "sessionId": "1234567890-abc123",
  "bonusMinutes": 15
}

Response:
{
  "success": true,
  "message": "Bonus time applied",
  "data": {
    "bonusMinutes": 15,
    "penalty": -3
  }
}
```

#### 5. Submit Quiz
```http
POST /api/submit-quiz
Content-Type: application/json

{
  "sessionId": "1234567890-abc123"
}

Response:
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "name": "John Doe",
    "totalCorrect": 350,
    "totalQuestions": 500,
    "totalScore": 347,
    "bonusTimeUsed": 15,
    "bonusPenalty": -3,
    "totalTimeSpent": 2700,
    "averageTimePerQuestion": 7.71,
    "submittedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

---

## 🔒 Security Features

### Server-Side Validation
- ✅ All scoring calculations done on backend
- ✅ Question correctness never sent to frontend
- ✅ Session verification for all API calls
- ✅ Rate limiting to prevent abuse

### Client-Side Protection
- ✅ Prevent page refresh during quiz
- ✅ Prevent multiple quiz attempts
- ✅ Local storage cleared after completion
- ✅ Session timeout handling

### Data Integrity
- ✅ Auto-save prevents data loss
- ✅ Unique session IDs
- ✅ Timestamp tracking
- ✅ Answer validation

---

## 🚢 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

1. **Set Environment Variables:**
```
MONGODB_URI=<your-mongodb-atlas-uri>
PORT=5000
NODE_ENV=production
CORS_ORIGIN=<your-frontend-url>
```

2. **Deploy:**
```bash
git push heroku main
```

3. **Seed Database:**
```bash
heroku run npm run seed
```

### Frontend Deployment (e.g., Vercel, Netlify)

1. **Update API URL:**
```
VITE_API_URL=<your-backend-url>/api
```

2. **Build:**
```bash
npm run build
```

3. **Deploy:**
```bash
vercel deploy
```

---

## 📊 Database Schema

### Question Model
```javascript
{
  questionNumber: Number (1-500, unique),
  question: String,
  options: [String, String, String, String],
  correctAnswer: Number (0-3),
  category: String (aptitude, logic, cs-basics, puzzles, general),
  difficulty: String (easy, medium, hard)
}
```

### Participant Model
```javascript
{
  name: String,
  sessionId: String (unique),
  quizStartTime: Date,
  quizEndTime: Date,
  answers: Map<questionNumber, selectedOption>,
  baseBonusSelected: Boolean,
  bonusTimeSelected: Number (0, 15, 20, 30),
  bonusPenalty: Number,
  totalCorrect: Number,
  totalScore: Number,
  totalTimeSpent: Number,
  averageTimePerQuestion: Number,
  isSubmitted: Boolean,
  submittedAt: Date
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If not running, start MongoDB service
# Windows:
net start MongoDB

# Mac/Linux:
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### CORS Issues
Make sure `CORS_ORIGIN` in backend `.env` matches your frontend URL exactly.

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check MongoDB connection
4. Verify environment variables

---

## 📄 License

MIT License - Feel free to use this for your college fest!

---

## 🎉 Credits

Built with ❤️ for **BACKTRACE - Round 1**

**Tech Stack:**
- React + Vite + Tailwind CSS
- Node.js + Express + MongoDB

---

**Happy Quizzing! 🚀**
