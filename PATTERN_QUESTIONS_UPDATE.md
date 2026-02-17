# 🔢 PATTERN RECOGNITION QUESTIONS UPDATE

## ✅ CHANGES MADE

### **All 500 questions replaced with Pattern Recognition questions**

---

## 📊 QUESTION BREAKDOWN

### **EASY (Questions 1-200)** - Simple Linear Patterns
Examples:
- **Multiplication:** Input × n = Output
  - Input: 2 → 10, Input: 3 → 15, Input: 4 → 20 (Rule: × 5)
  
- **Addition:** Input + n = Output
  - Input: 1 → 6, Input: 2 → 12, Input: 3 → 18 (Rule: × 6)

- **Simple Doubling:** Input × 2 = Output
  - Input: 4 → 8, Input: 5 → 10, Input: 6 → 12

**Total:** 200 questions
**Difficulty:** Easy
**Category:** `pattern-recognition`

---

### **MEDIUM (Questions 201-350)** - Combined Patterns
Examples:
- **Linear with offset:** (Input × n) + m = Output
  - Input: 2 → 6, Input: 3 → 11, Input: 4 → 18 (Rule: n² + 2)

- **Squared patterns:** Input² = Output
  - Input: 1 → 1, Input: 2 → 4, Input: 3 → 9

- **Multiplication with addition:** Input × (Input + n)
  - Input: 2 → 8, Input: 3 → 15, Input: 4 → 24 (Rule: n × (n + 2))

**Total:** 150 questions
**Difficulty:** Medium
**Category:** `pattern-recognition`

---

### **ADVANCED (Questions 351-500)** - Multi-step Patterns
Examples:
- **Complex formulas:** Input² + Input = Output
  - Input: 1 → 2, Input: 2 → 6, Input: 3 → 12, Input: 4 → 20

- **Multi-variable patterns:** Input × (Input + 1)
  - Input: 2 → 6, Input: 3 → 12, Input: 4 → 20, Input: 5 → 30

- **Progressive patterns:** Multiple inputs to deduce rule
  - Input: 2 → 8, Input: 3 → 18, Input: 4 → 32, Input: 5 → 50

**Total:** 150 questions
**Difficulty:** Hard
**Category:** `pattern-recognition`

---

## 🎯 QUESTION FORMAT

Each question follows this structure:

```javascript
{
  questionNumber: 1,
  question: "Input: 2 → 10, Input: 3 → 15, Input: 4 → 20. What is the output for Input: 5? (Q1)",
  options: ["20", "25", "30", "35"],
  correctAnswer: 1,  // Index 1 = "25"
  category: 'pattern-recognition',
  difficulty: 'easy'
}
```

### **Question Pattern:**
```
Input: X → Y
Input: X → Y  
Input: X → Y

What is the output for Input: Z?
```

### **Options:**
- Always 4 options (MCQ format)
- Only ONE correct answer
- `correctAnswer` is 0-based index (0, 1, 2, or 3)

---

## 🔧 HOW TO USE

### **1. Re-seed the Database**

```bash
cd backend
npm run seed
```

**Expected output:**
```
🌱 Starting database seed...
✅ Connected to MongoDB
🗑️  Cleared existing questions
📝 Generated 500 questions
✅ Successfully seeded 500 questions!
📊 Total questions in database: 500

📈 Breakdown by category:
   pattern-recognition: 500 questions
```

### **2. Restart Backend**

```bash
npm run dev
```

### **3. Test the Quiz**

1. Go to `http://localhost:5173`
2. Start quiz
3. All 500 questions are now pattern recognition questions
4. Questions progress from Easy → Medium → Hard

---

## 📝 SAMPLE QUESTIONS

### **Easy Example:**
```
Question 1:
Input: 2 → 10
Input: 3 → 15  
Input: 4 → 20

What is the output for Input: 5?

A) 20
B) 25  ← CORRECT (Rule: Input × 5)
C) 30
D) 35
```

### **Medium Example:**
```
Question 215:
Input: 2 → 6
Input: 3 → 11
Input: 4 → 18

What is the output for Input: 5?

A) 23
B) 25
C) 27  ← CORRECT (Rule: Input² + 2)
D) 29
```

### **Advanced Example:**
```
Question 375:
Input: 1 → 2
Input: 2 → 6
Input: 3 → 12
Input: 4 → 20

What is the output for Input: 5?

A) 28  ← CORRECT (Rule: Input × (Input + 1))
B) 30
C) 32
D) 35
```

---

## ✅ WHAT REMAINED UNCHANGED

- ✅ File structure (imports, exports, functions)
- ✅ MongoDB connection logic
- ✅ Question model schema
- ✅ Insert/seeding logic
- ✅ Question numbering (1-500)
- ✅ Variable names
- ✅ Function names
- ✅ Database operations

**Only the question content was changed.**

---

## 🎓 PATTERN TYPES USED

### Easy Patterns:
1. **Simple Multiplication:** Output = Input × n
2. **Simple Addition:** Output = Input + n
3. **Simple Doubling/Tripling:** Output = Input × 2/3

### Medium Patterns:
1. **Squared:** Output = Input²
2. **Linear Combination:** Output = (Input × a) + b
3. **Product Pattern:** Output = Input × (Input ± n)

### Advanced Patterns:
1. **Quadratic:** Output = Input² + Input
2. **Complex Product:** Output = Input × (Input + 1)
3. **Multi-step:** Requires identifying pattern from 4+ data points

---

## 🔍 VERIFICATION

To verify questions were updated:

```bash
# Connect to MongoDB
mongosh

# Use database
use backtrace-quiz

# Check first question
db.questions.findOne({ questionNumber: 1 })

# Should show pattern recognition question
# Category should be: "pattern-recognition"

# Check count
db.questions.countDocuments()
# Should return: 500

# Check categories
db.questions.distinct("category")
# Should return: ["pattern-recognition"]
```

---

## 📦 FILES MODIFIED

**Only 1 file changed:**
- ✏️ `backend/seedQuestions.js` - All 500 questions replaced

**Everything else unchanged:**
- ✅ `backend/server.js`
- ✅ `backend/models/Question.js`
- ✅ `backend/models/Participant.js`
- ✅ All frontend files
- ✅ All configuration files

---

## ⚡ TIMER REMINDER

**Current timer setting:** 5 minutes (modified earlier)

Located in: `frontend/src/components/Timer.jsx`
```javascript
function Timer({ onTimeUp, onBonusSelect, baseTimeMinutes = 5 }) {
```

To change back to 30 minutes or any other duration, edit the number above.

---

**ALL DONE! 🎉**

Your quiz now has 500 Pattern Recognition questions ready to use!
