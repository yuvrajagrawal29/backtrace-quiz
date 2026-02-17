# 🚀 QUICK START GUIDE

## Get Up and Running in 5 Minutes!

### Step 1: Install Dependencies (2 min)

```bash
# Backend
cd backend
npm install

# Frontend (open new terminal)
cd frontend
npm install
```

### Step 2: Setup Environment Variables (1 min)

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```
Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/backtrace-quiz
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
```
Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB (30 sec)

**Windows:**
```bash
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 4: Seed Database (30 sec)

```bash
cd backend
npm run seed
```

You should see:
```
✅ Successfully seeded 500 questions!
```

### Step 5: Run Application (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Open Browser

Navigate to: `http://localhost:5173`

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] 500 questions seeded in database
- [ ] Landing page loads successfully

---

## 🎯 Test the Application

1. Enter name: "Test User"
2. Click "Start Quiz"
3. Answer a few questions
4. Check timer is working
5. Navigate between questions
6. Submit quiz
7. View results

---

## 🐛 Common Issues

**MongoDB not running:**
```bash
mongosh
# If it connects, MongoDB is running
```

**Port already in use:**
```bash
# Change PORT in backend/.env to 5001
# Change VITE_API_URL in frontend/.env to http://localhost:5001/api
```

**Database seed fails:**
```bash
# Make sure MongoDB is running first
# Delete existing database and try again
mongosh
use backtrace-quiz
db.dropDatabase()
exit
npm run seed
```

---

## 📖 Next Steps

- Read full `README.md` for detailed documentation
- Check API endpoints in README
- Customize questions in `seedQuestions.js`
- Deploy to production (see README deployment section)

---

**Happy Coding! 🎉**
