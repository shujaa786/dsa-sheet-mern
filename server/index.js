// index.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import progressRoutes from './routes/progress.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();

// --- Environment validation ---------------------------------
const requiredEnv = ['JWT_SECRET'];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  console.error('Create a `.env` file or set the environment variables. See `.env.example` for reference.');
  process.exit(1);
}
// -------------------------------------------------------------

// Basic security + parsers
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Trust the EB/nginx proxy BEFORE any middleware that relies on req.ip or X-Forwarded-For
// If behind a single proxy (Elastic Beanstalk), '1' is recommended.
app.set('trust proxy', 1);

// CORS (allow credentials so cookies can be sent)
const PROD_ORIGIN = process.env.CLIENT_ORIGIN;
const DEV_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];

// Build allowed list, prefer explicit entries
const allowedOrigins = [];
if (PROD_ORIGIN) allowedOrigins.push(PROD_ORIGIN);
allowedOrigins.push(...DEV_ORIGINS);

app.use(cors({
  origin: (origin, callback) => {
    // If no origin (curl/Postman/server-to-server) allow it
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    // For debugging: print origin and return error to client
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('CORS not allowed for origin: ' + origin));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept','Origin','X-Requested-With']
}));

// Rate limiter (placed after trust proxy)
// Consider using a shared store (Redis) if you run multiple instances.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Serve static files (if you have a public folder)
app.use(express.static(path.join(process.cwd(), 'public')));

// Simple health endpoint for EB health checks
app.get('/health', (req, res) => res.status(200).send('OK'));

// Favicon handler to avoid unnecessary upstream logging/noise
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');
  res.sendFile(faviconPath, (err) => {
    if (err) res.status(204).end(); // no content if not found
  });
});

// Debug route (keep for troubleshooting)
app.post('/__debug_headers', (req, res) => {
  res.json({
    authHeader: req.headers.authorization || null,
    cookies: req.cookies || null,
    contentType: req.headers['content-type'] || null,
    rawBody: req.body || null,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/progress', authMiddleware, progressRoutes);

// Graceful error logging for unexpected crashes (helpful in EB logs)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err);
  // optionally: process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
  // optionally: process.exit(1);
});

// DB + start server
const PORT = process.env.PORT || 8080;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_sheet';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server started on ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

export default app;
