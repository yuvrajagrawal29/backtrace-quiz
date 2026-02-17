# 🚀 DEPLOYMENT GUIDE

Complete guide for deploying Backtrace Quiz to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Database seeded with 500 questions
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Build tested successfully

---

## 🗄️ Database Deployment (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free tier
3. Create a new cluster

### Step 2: Setup Database Access
1. Database Access → Add New Database User
2. Set username and password (save these!)
3. Network Access → Add IP Address
4. Choose "Allow access from anywhere" (0.0.0.0/0)

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your password
5. Replace `<dbname>` with `backtrace-quiz`

Example:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/backtrace-quiz?retryWrites=true&w=majority
```

### Step 4: Seed Production Database
```bash
# Set MONGODB_URI to your Atlas connection string
export MONGODB_URI="mongodb+srv://..."

# Run seeder
npm run seed
```

---

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended - Free Tier Available)

1. **Install Railway CLI:**
```bash
npm install -g railway
```

2. **Login:**
```bash
railway login
```

3. **Initialize Project:**
```bash
cd backend
railway init
```

4. **Set Environment Variables:**
```bash
railway variables set MONGODB_URI="your-atlas-uri"
railway variables set PORT=5000
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN="your-frontend-url"
```

5. **Deploy:**
```bash
railway up
```

6. **Get URL:**
```bash
railway domain
```

### Option 2: Render

1. Go to [Render](https://render.com)
2. New → Web Service
3. Connect your GitHub repository
4. Configure:
   - **Name:** backtrace-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables (same as above)
6. Click "Create Web Service"

### Option 3: Heroku

1. **Install Heroku CLI:**
```bash
npm install -g heroku
```

2. **Login:**
```bash
heroku login
```

3. **Create App:**
```bash
cd backend
heroku create backtrace-backend
```

4. **Set Environment Variables:**
```bash
heroku config:set MONGODB_URI="your-atlas-uri"
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN="your-frontend-url"
```

5. **Deploy:**
```bash
git push heroku main
```

6. **Seed Database:**
```bash
heroku run npm run seed
```

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Build:**
```bash
cd frontend
npm run build
```

3. **Deploy:**
```bash
vercel
```

4. **Set Environment Variable:**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `your-backend-url/api`

5. **Redeploy:**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build:**
```bash
cd frontend
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod
```

4. **Set Environment Variables:**
   - Go to Netlify Dashboard
   - Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `your-backend-url/api`

### Option 3: Manual (Any Static Hosting)

1. **Build:**
```bash
cd frontend
npm run build
```

2. **Upload `dist/` folder** to:
   - GitHub Pages
   - AWS S3
   - Google Cloud Storage
   - Any static host

3. **Configure Environment:**
   - Create `.env.production` before building
   - Set `VITE_API_URL` to your backend URL

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS
In your backend `.env`:
```
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. Test All Endpoints
```bash
# Health check
curl https://your-backend-url/api/health

# Start quiz (replace with your backend URL)
curl -X POST https://your-backend-url/api/start-quiz \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User"}'
```

### 3. Verify Database Connection
Check your deployment logs to ensure MongoDB connection is successful.

---

## 🔒 Security Checklist

- [ ] Environment variables set (not hardcoded)
- [ ] MongoDB connection string secure
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] Database user has minimal permissions

---

## 📊 Monitoring

### Backend Monitoring
- Check deployment logs regularly
- Monitor API response times
- Track error rates
- Set up alerts for downtime

### Database Monitoring
- MongoDB Atlas dashboard
- Monitor connection count
- Check slow queries
- Set storage alerts

---

## 🔄 Continuous Deployment

### Setup Auto-Deploy (GitHub)

**Vercel (Frontend):**
1. Connect GitHub repository
2. Auto-deploys on every push to main

**Railway/Render (Backend):**
1. Connect GitHub repository
2. Auto-deploys on every push to main

---

## 🚨 Rollback Plan

### Railway/Render
```bash
# View deployments
railway deployments list

# Rollback to previous
railway rollback
```

### Vercel
```bash
# View deployments
vercel list

# Promote previous deployment
vercel promote <deployment-url>
```

---

## 📝 Environment Variables Summary

### Backend
```
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
```

### Frontend
```
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🧪 Testing Production

1. **Smoke Test:**
   - Visit landing page
   - Start quiz
   - Answer questions
   - Submit quiz
   - View results

2. **Performance Test:**
   - Check page load times
   - Test API response times
   - Monitor timer accuracy

3. **Security Test:**
   - Try refreshing during quiz
   - Try multiple submissions
   - Verify scoring calculation

---

## 📞 Troubleshooting

**API not connecting:**
- Check CORS settings
- Verify `VITE_API_URL` is correct
- Check backend deployment logs

**Database errors:**
- Verify MongoDB Atlas IP whitelist
- Check connection string
- Ensure database user has permissions

**Build failures:**
- Check Node version compatibility
- Verify all dependencies installed
- Review build logs

---

## 🎯 Production URLs Example

```
Frontend: https://backtrace-quiz.vercel.app
Backend:  https://backtrace-backend.railway.app
Database: MongoDB Atlas Cluster
```

---

## ✅ Final Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database seeded with 500 questions
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] All features tested in production
- [ ] Monitoring setup
- [ ] Backup plan in place

---

**Deployment Complete! 🎉**

Your quiz platform is now live and ready for the college fest!
