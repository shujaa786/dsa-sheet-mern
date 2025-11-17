import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';  
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import progressRoutes from './routes/progress.js';
import { authMiddleware } from './middleware/auth.js';


const app = express();

// --- Environment validation ---------------------------------
// Ensure required environment variables are present so startup fails fast
const requiredEnv = ['JWT_SECRET'];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  console.error('Create a `server/.env` file or set the environment variables. See `server/.env.example` for reference.');
  process.exit(1);
}
// -------------------------------------------------------------

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', // frontend URL
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));
app.use(cookieParser()); 

app.post('/__debug_headers', (req, res) => {
  res.json({
    authHeader: req.headers.authorization || null,
    cookies: req.cookies || null,
    contentType: req.headers['content-type'] || null,
    rawBody: req.body || null
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/progress', authMiddleware, progressRoutes);

const PORT = process.env.PORT || 8080;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_sheet';


mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Server started on ${PORT}`)))
.catch(err => {
console.error('MongoDB connection error:', err.message);
process.exit(1);
});

export default app;