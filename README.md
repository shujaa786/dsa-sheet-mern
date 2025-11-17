# DSA Sheet – MERN Stack Practice Tracker

![MERN Stack](https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge&logo=javascript&logoColor=yellow)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

A **full-stack DSA practice tracker** built with the **MERN stack** (MongoDB, Express, React, Node.js).

Solve and track your progress across 450+ curated problems, organized by topics with YouTube solutions, LeetCode links, and difficulty levels.

**Live Demo** (when deployed):  
Frontend:
https://main.d3655aq63mcd1k.amplifyapp.com/login

Backend API (CloudFront → Elastic Beanstalk):
https://d355gi9xu9cucb.cloudfront.net/api

---

## Features

- **Secure Authentication** – JWT + HttpOnly cookies (no token in localStorage)
- **Per-user Progress Tracking** – Mark problems as Not Started / Solving / Solved
- **Rich Problem Metadata** – Topic, difficulty (Easy/Medium/Hard), YouTube video, LeetCode link, articles
- **Responsive UI** – Clean, modern design with cards and progress badges
- **Production Ready** – Deployed on AWS (Elastic Beanstalk + CloudFront + Amplify)
- **Cross-site Cookie Support** – Secure cookies work between Amplify (frontend) and EB (backend)

---

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18 + Tailwind CSS      |
| Backend     | Node.js + Express                   |
| Database    | MongoDB Atlas                       |
| Auth        | JWT + HttpOnly + Secure Cookies     |
| Deployment  | AWS Elastic Beanstalk, Amplify, CloudFront |

---

## Local Development

### 1. Backend (`server/`)

```bash
cd server
cp .env.example .env
# Edit .env and set:
# MONGO_URI=mongodb://127.0.0.1:27017/dsa-sheet
# JWT_SECRET=your_strong_secret_here
# CLIENT_ORIGIN=http://localhost:3000
# COOKIE_SECURE=false
# COOKIE_SAME_SITE=lax

npm install
node seed.js        # optional: seed topics & test user
node index.js       # starts on http://localhost:5000
```

#### 2. Frontend (`client/`)

```bash
cd client
npm install
```


## 🔧 Run Commands (Backend + Frontend)

| Environment | Location | Command | Purpose |
|------------|----------|---------|---------|
| **Backend** | `/server` | `npm install` | Install backend dependencies |
| **Backend** | `/server` | `cp .env.example .env` | Create environment file |
| **Backend** | `/server` | `node seed.js` | Seed default problems/topics (optional) |
| **Backend** | `/server` | `node index.js` | Start backend server (default: port 5000) |
| **Backend** | `/server` | `npm run dev` *(if using nodemon)* | Auto-restart server during development |
| **Frontend** | `/client` | `npm install` | Install frontend dependencies |
| **Frontend** | `/client` | `npm start` | Run development server (port 3000) |
| **Frontend** | `/client` | `npm run build` | Create production build |
| **API Tests** | Any | `curl -i <API_URL>/api/health` | Test backend health |
| **API Tests** | Any | `curl -X POST <API_URL>/api/auth/login` | Test login route |
| **Production** | AWS EB | `eb deploy` | Deploy backend to Elastic Beanstalk |
| **Production** | AWS Amplify | Auto-build | Deploy frontend (Amplify watches repo) |




### API Endpoints

| Method | Endpoint                | Description                          | Auth Required |
|--------|-------------------------|--------------------------------------|---------------|
| `POST` | `/api/auth/login`       | Login (sets HttpOnly cookie)         | No            |
| `GET`  | `/api/auth/logout`      | Clear cookie                         | No            |
| `GET`  | `/api/problems`         | Get all topics & problems            | No            |
| `GET`  | `/api/problems/:topic`  | Problems by topic                    | No            |
| `GET`  | `/api/progress`         | Get current user progress            | Yes           |
| `PUT`  | `/api/progress/update`  | Update problem status                | Yes           |
| `GET`  | `/api/health`           | Health check                         | No            |


### Quick Tests (cURL)

| Purpose              | Command |
|----------------------|---------|
| **Health Check**     | `curl -i http://localhost:5000/api/health` |
| **Login** (test account) | `curl -i -X POST http://localhost:5000/api/auth/login \<br>  -H "Content-Type: application/json" \<br>  -d '{"email":"test@demo.com","password":"password123"}'` |
| **Save cookie & login** (recommended) | `curl -i -X POST http://localhost:5000/api/auth/login \<br>  -H "Content-Type: application/json" \<br>  -d '{"email":"test@demo.com","password":"password123"}' \<br>  --cookie-jar cookie.txt` |
| **Fetch Problems** (with saved cookie) | `curl http://localhost:5000/api/problems --cookie cookie.txt` |
| **Fetch User Progress** (authenticated) | `curl http://localhost:5000/api/progress --cookie cookie.txt` |

**Tip**: Use `--cookie-jar cookie.txt` on login to persist the HttpOnly session cookie, then reuse it with `--cookie cookie.txt` for authenticated requests.

### ☁️ Production Deployment

#### Backend – AWS Elastic Beanstalk
- **Platform**: Node.js 22 running on 64bit Amazon Linux 2023  
- **Recommended**: Put **CloudFront** (or an ALB with HTTPS) in front of Elastic Beanstalk for proper HTTPS termination  
- **Port**: Your app must listen on `process.env.PORT` (EB sets this to `8080`)

**Required Environment Variables (set in EB Console → Configuration → Software):**

| Variable             | Value / Example                                                               | Notes                                      |
|----------------------|-------------------------------------------------------------------------------|--------------------------------------------|
| `MONGO_URI`          | `your-mongodb-connection-string` | Your production MongoDB Atlas connection   |
| `JWT_SECRET`         | `your_very_strong_random_secret`                                | Keep secret!                               |
| `CLIENT_ORIGIN`      | `https://your-frontend-domain.com`                               | **No trailing slash!**                     |
| `COOKIE_SECURE`      | `true`                                                                        | Required for `SameSite=None`               |
| `COOKIE_SAME_SITE`   | `none`                                                                        | Allows cross-site cookies                  |
| `NODE_ENV`           | `production`                                                                  | Optional but recommended                   |
| `PORT`               | `8080`                                                                        | EB injects this automatically              |

#### Frontend – AWS Amplify (Recommended)
- Connect your GitHub/GitLab repo → Amplify auto-detects Vite/React
- One-click HTTPS + global CDN

**Frontend Environment Variable (set in Amplify Console → Environment variables):**

| Variable               | Value                                                                 |
|------------------------|-----------------------------------------------------------------------|
| `REACT_APP_API_URL`    | `(https://your-frontend-domain.com)` |

> **Important HTTPS Rule**  
> When `COOKIE_SECURE=true` and `COOKIE_SAME_SITE=none`:  
> → **Both** frontend **and** backend **must be served over HTTPS**  
> → Use **CloudFront** in front of Elastic Beanstalk (or switch to ALB + ACM certificate)


### Test Account (Pre-seeded)

A demo user is automatically created when you run `node seed.js` (or on first deployment if your seed script is included).

| Field     | Value               |
|-----------|---------------------|
| **Email**    | `test@demo.com`     |
| **Password** | `password123`       |

**Quick login (cURL)**  
```bash
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@demo.com","password":"password123"}' \
  --cookie-jar cookie.txt

