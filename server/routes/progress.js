// import express from 'express';
// import User from '../models/User.js';


// const router = express.Router();


// // get progress for current user
// router.get('/', async (req, res) => {
// const user = await User.findById(req.user._id).populate('progress.problemId');
// res.json(user.progress || []);
// });


// // toggle completion
// router.post('/', async (req, res) => {
// const { problemId } = req.body;
// const user = await User.findById(req.user._id);
// const idx = user.progress.findIndex(p => p.problemId.toString() === problemId);
// if (idx >= 0) {
// user.progress.splice(idx, 1);
// } else {
// user.progress.push({ problemId, completedAt: new Date() });
// }
// await user.save();
// res.json(user.progress);
// });


// export default router;

import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Ensure body parsing inside this router (safe to call even if app already uses express.json())
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Quick logger to inspect incoming requests
router.use((req, res, next) => {
  console.log('> PROGRESS ROUTE:', req.method, req.path);
  console.log('  content-type:', req.headers['content-type']);
  console.log('  raw body:', req.body);
  next();
});

// get progress for current user
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.userProgress) return res.json([]);
    return res.json(user.userProgress.completed || []);
  } catch (err) {
    console.error('GET /progress error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// toggle completion
router.post('/', async (req, res) => {
  try {
    // Defensive checks
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'Empty request body. Is Content-Type: application/json set?'
      });
    }

    const { problemId } = req.body;
    if (!problemId) {
      return res.status(400).json({ error: 'problemId missing' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.userProgress) user.userProgress = { userId: req.user._id, completed: [] };
    if (!user.userProgress.completed) user.userProgress.completed = [];

    const idx = user.userProgress.completed.findIndex(p => p.problemId === problemId);
    if (idx >= 0) {
      user.userProgress.completed.splice(idx, 1);
    } else {
      user.userProgress.completed.push({ problemId, completedAt: new Date() });
    }
    await user.save();
    return res.json(user.userProgress.completed);
  } catch (err) {
    console.error('POST /progress error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;