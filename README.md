 # DSA Sheet - MERN

## Features
- Secure login (JWT)
- Topic/Problem listing with links (YouTube, LeetCode, Article)
- Level indicator (Easy/Medium/Tough)
- Progress tracker (checkbox) per user, persisted to MongoDB
- Deployment-ready for AWS

## Run locally
### Backend
cd server
cp .env.example .env
# fill MONGO_URI and JWT_SECRET
npm install
node seed.js   # optional seed
node index.js

### Frontend
cd client
npm install
# in development:
npm start
# production build:
npm run build

## Deploy
- Backend: AWS Elastic Beanstalk (or EC2)
- Frontend: AWS Amplify or S3 + CloudFront

 
  "email": "test@demo.com",
  "password": "password123"
  "email": "shuja@test.com",
  "password": "123456"