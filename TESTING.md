# 🧪 TESTING & VERIFICATION GUIDE

Complete testing checklist to ensure your Backtrace Quiz platform is working correctly.

---

## 📋 Pre-Testing Checklist

Before running tests, ensure:
- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5173)
- [ ] Database is seeded with 500 questions
- [ ] Environment variables are correctly set

---

## 🎯 Functional Testing

### 1. Landing Page Tests

#### Test 1.1: Page Load
- [ ] Landing page loads successfully
- [ ] "BACKTRACE" title is visible
- [ ] Quiz details are displayed
- [ ] Name input field is present
- [ ] "Start Quiz" button is visible

#### Test 1.2: Name Validation
- [ ] Empty name shows error
- [ ] Single character shows error
- [ ] Valid name (2+ chars) is accepted
- [ ] Whitespace is trimmed
- [ ] Special characters are allowed

#### Test 1.3: Quiz Start
- [ ] Clicking "Start Quiz" with valid name works
- [ ] Loading state appears during API call
- [ ] Redirect to /quiz page occurs
- [ ] Session data stored in localStorage
- [ ] Error handling works for network issues

**Manual Test:**
```
1. Open http://localhost:5173
2. Try submitting empty name → Should show error
3. Enter "A" → Should show error
4. Enter "Test User" → Should succeed
5. Check localStorage → Should have sessionId
```

---

### 2. Quiz Page Tests

#### Test 2.1: Initial Load
- [ ] Quiz page loads successfully
- [ ] Timer starts automatically
- [ ] First question (Q1) is displayed
- [ ] All 4 options are visible
- [ ] Navigation buttons present
- [ ] Question grid shows 500 questions
- [ ] Progress shows 0/500

#### Test 2.2: Question Display
- [ ] Question text is readable
- [ ] Options are clearly labeled
- [ ] Category badge is shown
- [ ] Question number is correct
- [ ] No correct answer is revealed

#### Test 2.3: Answer Selection
- [ ] Clicking an option selects it
- [ ] Selected option is highlighted
- [ ] Only one option can be selected
- [ ] Selection persists on navigation
- [ ] Progress counter updates

#### Test 2.4: Navigation
- [ ] "Next" button works
- [ ] "Previous" button works
- [ ] "Previous" disabled on Q1
- [ ] Jumping to question via grid works
- [ ] Current question highlighted in grid
- [ ] Answered questions marked green
- [ ] Unanswered questions marked gray

#### Test 2.5: Auto-Save
- [ ] Answers auto-save every 10 seconds
- [ ] "Saving..." indicator appears
- [ ] No UI freezing during save
- [ ] Answers persist after refresh attempt

#### Test 2.6: Progress Tracking
- [ ] Answered count increases
- [ ] Total count shows 500
- [ ] Grid shows answered vs unanswered

**Manual Test:**
```
1. Answer first 5 questions
2. Wait 10 seconds → Check "Saving..." appears
3. Try to refresh page → Should show warning
4. Navigate to Q100 using grid
5. Navigate back to Q1 → Answer should persist
6. Check answered count in header
```

---

### 3. Timer Tests

#### Test 3.1: Timer Display
- [ ] Timer shows MM:SS format
- [ ] Timer counts down every second
- [ ] Timer is always visible (fixed position)
- [ ] Color changes based on time:
  - Green when > 5 minutes
  - Yellow when 2-5 minutes
  - Red when < 2 minutes

#### Test 3.2: Base Time (30 minutes)
- [ ] Timer starts at 30:00
- [ ] Counts down correctly
- [ ] No manual pause option
- [ ] No manual reset option

#### Test 3.3: Bonus Time Modal
- [ ] Modal appears when base time ends
- [ ] Shows all 3 bonus options
- [ ] Shows "Submit Now" option
- [ ] Modal cannot be dismissed
- [ ] Bonus selection works
- [ ] Timer extends correctly
- [ ] Penalty message shown

#### Test 3.4: Bonus Time Selection
- [ ] +15 min option works
- [ ] +20 min option works
- [ ] +30 min option works
- [ ] Timer resets to selected time
- [ ] "Bonus Time" label appears
- [ ] Cannot select bonus twice

#### Test 3.5: Auto-Submit
- [ ] Quiz auto-submits when time ends
- [ ] Quiz auto-submits when bonus time ends
- [ ] Confirmation message shown
- [ ] Redirect to results occurs

**Manual Test (Accelerated):**
```
To test quickly, modify Timer.jsx baseTimeMinutes to 1:

const [timeRemaining, setTimeRemaining] = useState(1 * 60);

1. Start quiz
2. Wait 1 minute
3. Bonus modal should appear
4. Select +15 min
5. Wait 15 more seconds (or modify to lower time)
6. Should auto-submit
```

---

### 4. Submission Tests

#### Test 4.1: Manual Submission
- [ ] "Submit Quiz" button visible
- [ ] Confirmation dialog appears
- [ ] Shows answered/total count
- [ ] Can cancel submission
- [ ] Can confirm submission
- [ ] Redirect to results occurs

#### Test 4.2: Submission Prevention
- [ ] Cannot submit twice
- [ ] Cannot go back after submit
- [ ] Session marked as submitted
- [ ] Cannot restart same session

**Manual Test:**
```
1. Answer 10 questions
2. Click "Submit Quiz"
3. Should show: "You have answered 10 out of 500..."
4. Click "Cancel" → Should stay on quiz
5. Click "Submit Quiz" again
6. Click "OK" → Should go to results
7. Try to go back → Should not allow
```

---

### 5. Results Page Tests

#### Test 5.1: Results Display
- [ ] Participant name shown
- [ ] Final score displayed
- [ ] Total correct shown
- [ ] Percentage calculated correctly
- [ ] Time spent shown
- [ ] Average time per question shown
- [ ] Performance message shown

#### Test 5.2: Score Breakdown
- [ ] Base score shown
- [ ] Bonus penalty shown (if used)
- [ ] Final score calculation correct
- [ ] All stats accurate

#### Test 5.3: Performance Messages
- [ ] ≥90% → "Outstanding! 🏆"
- [ ] ≥75% → "Excellent! 🌟"
- [ ] ≥60% → "Good Job! 👍"
- [ ] ≥50% → "Not Bad! 💪"
- [ ] <50% → "Keep Practicing! 📚"

#### Test 5.4: Results Actions
- [ ] "Take Quiz Again" button works
- [ ] localStorage is cleared
- [ ] Redirect to landing page
- [ ] Can start new quiz

**Manual Test:**
```
1. Complete a quiz
2. Verify all numbers match what you expect
3. Check calculation:
   Final Score = Correct - Bonus Penalty
4. Click "Take Quiz Again"
5. Should go to landing page
6. localStorage should be empty
```

---

## 🔒 Security Testing

### Anti-Cheat Tests

#### Test 6.1: Refresh Prevention
- [ ] Browser refresh shows warning
- [ ] Refresh doesn't restart quiz
- [ ] Refresh doesn't reset timer
- [ ] Answers persist after refresh attempt

#### Test 6.2: Multiple Attempts
- [ ] Cannot start quiz twice with same session
- [ ] New session ID generated each time
- [ ] Previous session data isolated

#### Test 6.3: Server-Side Scoring
- [ ] Score calculated on backend
- [ ] Correct answers not in frontend response
- [ ] Cannot manipulate score via browser
- [ ] Results match backend calculation

**Manual Test:**
```
1. Start quiz
2. Open browser console
3. Try to modify localStorage answers
4. Submit quiz
5. Check results → Should match server calculation

6. Try to inspect network response for /questions
7. Verify correctAnswer is NOT present

8. Try to call /submit-quiz twice
9. Second call should fail
```

---

## 🚀 Performance Testing

### Test 7.1: Load Time
- [ ] Landing page loads < 2 seconds
- [ ] Quiz page loads < 3 seconds
- [ ] Question navigation < 100ms
- [ ] Auto-save response < 500ms

### Test 7.2: Memory Usage
- [ ] No memory leaks during quiz
- [ ] Browser memory stable
- [ ] No console errors

### Test 7.3: API Response Times
```bash
# Test API health
curl http://localhost:5000/api/health

# Time should be < 100ms
```

**Manual Test:**
```
1. Open Chrome DevTools
2. Go to Performance tab
3. Start quiz
4. Record session for 30 seconds
5. Check for:
   - FPS should be 60
   - No long tasks
   - No memory spikes
```

---

## 📱 Responsive Testing

### Test 8.1: Mobile View (375px)
- [ ] Landing page readable
- [ ] Quiz interface usable
- [ ] Timer visible
- [ ] Buttons accessible
- [ ] Question grid scrollable

### Test 8.2: Tablet View (768px)
- [ ] Layout adjusts properly
- [ ] All features accessible
- [ ] Navigation smooth

### Test 8.3: Desktop View (1920px)
- [ ] Wide layout utilized
- [ ] Content not stretched
- [ ] Readable spacing

**Manual Test:**
```
1. Open Chrome DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Desktop (1920x1080)
4. Check all pages
5. Verify touch targets are adequate
```

---

## 🌐 Cross-Browser Testing

### Test 9.1: Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Styles render correctly

### Test 9.2: Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Styles render correctly

### Test 9.3: Safari
- [ ] All features work
- [ ] No console errors
- [ ] Styles render correctly

### Test 9.4: Edge
- [ ] All features work
- [ ] No console errors
- [ ] Styles render correctly

---

## 🗄️ Database Testing

### Test 10.1: Question Seeding
```bash
cd backend
npm run seed
```
Expected output:
```
✅ Successfully seeded 500 questions!
📊 Total questions in database: 500

📈 Breakdown by category:
   aptitude: 100 questions
   logic: 100 questions
   cs-basics: 150 questions
   puzzles: 100 questions
   general: 50 questions
```

### Test 10.2: Data Integrity
```bash
# Connect to MongoDB
mongosh

# Use database
use backtrace-quiz

# Check questions count
db.questions.countDocuments()
// Should return: 500

# Check unique question numbers
db.questions.distinct("questionNumber").length
// Should return: 500

# Check participant schema
db.participants.findOne()
// Should show complete schema
```

---

## 🔄 Integration Testing

### Test 11: End-to-End Flow
1. **Start Quiz**
   - [ ] Enter name
   - [ ] Session created
   - [ ] Timer starts

2. **Answer Questions**
   - [ ] Answer 50 questions
   - [ ] Navigate using grid
   - [ ] Check auto-save works

3. **Wait for Base Time**
   - [ ] Bonus modal appears
   - [ ] Select +15 min
   - [ ] Timer extends

4. **Complete Quiz**
   - [ ] Answer more questions
   - [ ] Manual submit
   - [ ] Results correct

5. **Verify Results**
   - [ ] Score matches answers
   - [ ] Penalty applied correctly
   - [ ] Time calculated properly

---

## 🧰 Automated Testing (Optional)

### Backend API Tests
```javascript
// Using Jest + Supertest
describe('Quiz API', () => {
  test('POST /api/start-quiz creates session', async () => {
    const res = await request(app)
      .post('/api/start-quiz')
      .send({ name: 'Test User' });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sessionId).toBeDefined();
  });
  
  // Add more tests...
});
```

### Frontend Component Tests
```javascript
// Using React Testing Library
describe('LandingPage', () => {
  test('renders landing page', () => {
    render(<LandingPage />);
    expect(screen.getByText('BACKTRACE')).toBeInTheDocument();
  });
  
  // Add more tests...
});
```

---

## ✅ Final Verification Checklist

Before declaring the application production-ready:

### Core Functionality
- [ ] User can start quiz
- [ ] All 500 questions load
- [ ] Timer works correctly
- [ ] Bonus time system works
- [ ] Quiz can be submitted
- [ ] Results are accurate

### Security
- [ ] Refresh prevention works
- [ ] Server-side scoring verified
- [ ] Session validation works
- [ ] No client-side manipulation possible

### Performance
- [ ] Fast load times
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Responsive on all devices

### User Experience
- [ ] Intuitive navigation
- [ ] Clear instructions
- [ ] Error messages helpful
- [ ] Visual feedback present

### Data Integrity
- [ ] Answers saved correctly
- [ ] Results calculated accurately
- [ ] Timestamps recorded
- [ ] No data loss

---

## 🐛 Common Issues & Solutions

### Issue 1: Timer not starting
**Solution:** Check if quizStartTime is set in backend

### Issue 2: Questions not loading
**Solution:** Verify MongoDB connection and seed data

### Issue 3: Auto-save not working
**Solution:** Check browser console for errors, verify API endpoint

### Issue 4: Bonus modal not appearing
**Solution:** Check timer logic, ensure baseTimeEnded state updates

### Issue 5: Results calculation wrong
**Solution:** Verify server-side calculateResults method

---

## 📊 Test Report Template

```
BACKTRACE QUIZ - TEST REPORT
=============================

Date: [DATE]
Tester: [NAME]
Version: 1.0.0

FUNCTIONAL TESTS
- Landing Page: [PASS/FAIL]
- Quiz Interface: [PASS/FAIL]
- Timer System: [PASS/FAIL]
- Submission: [PASS/FAIL]
- Results Page: [PASS/FAIL]

SECURITY TESTS
- Anti-Cheat: [PASS/FAIL]
- Server-Side Validation: [PASS/FAIL]

PERFORMANCE TESTS
- Load Time: [PASS/FAIL]
- Response Time: [PASS/FAIL]

COMPATIBILITY TESTS
- Chrome: [PASS/FAIL]
- Firefox: [PASS/FAIL]
- Mobile: [PASS/FAIL]

OVERALL STATUS: [PASS/FAIL]

NOTES:
[Any observations or issues found]
```

---

**Testing Complete! 🎉**

Your Backtrace Quiz platform is now ready for production deployment!
