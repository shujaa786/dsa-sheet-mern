# DSA Sheet – MERN Stack Practice Tracker

![MERN Stack](https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge&logo=javascript&logoColor=yellow)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

A **full-stack DSA practice tracker** built with the **MERN stack** (MongoDB, Express, React, Node.js). Track your progress across 450+ curated problems, organized by topics with YouTube solutions, LeetCode links, and difficulty levels.

**Live Demo** (when deployed):  
Frontend: https://main.d3655aq63mcd1k.amplifyapp.com  
Backend: https://dsa-backend-env.eba-jfcs5nqc.us-east-1.elasticbeanstalk.com

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

#### 2. Frontend (client/)


Open terminal:

cd client
npm install


Local dev:

npm start


Production build:

npm run build


Frontend default URL: http://localhost:3000

Frontend env file (/client/.env):

REACT_APP_API_URL=http://localhost:5000/api

🔁 API overview

Auth

POST /api/auth/login — login (returns cookie or token)

GET /api/auth/logout — logout

Problems / Topics

GET /api/problems — list topics & problems

GET /api/problems/:topic — problems by topic

Progress (protected)

GET /api/progress — user progress

PUT /api/progress/update — update a problem progress

Health

GET /api/health

🧪 Quick tests (curl)

Health:

curl -i http://localhost:5000/api/health


Login (example):

curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@demo.com","password":"password123"}'


Fetch problems:

curl http://localhost:5000/api/problems

☁️ Deployment (production)
Backend

Elastic Beanstalk running Node.js 22

Optionally place CloudFront in front of the EB URL for HTTPS

Frontend

Deploy on AWS Amplify, Netlify, or S3+CloudFront

Important production env vars (server)
MONGO_URI=<production mongo uri>
JWT_SECRET=<strong secret>
CLIENT_ORIGIN=https://<your-frontend-domain>     # exact origin, no trailing slash
COOKIE_SECURE=true
COOKIE_SAME_SITE=none

Frontend (Amplify) env
REACT_APP_API_URL=https://<your-api-domain>/api


Note: If frontend is served over HTTPS, the API must be HTTPS (CloudFront or ALB). Cookies with SameSite=None must be Secure.

🔐 Test account

Use this credential for quick testing (seeded):

{
  "email": "test@demo.com",
  "password": "password123"
}

🤝 Contributing

PRs and issues are welcome. Please open an issue for:

Bug reports

Feature requests

Docs or sample data improvements

📄 License

MIT License
