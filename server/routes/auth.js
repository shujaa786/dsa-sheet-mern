import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();

router.post('/register', async (req, res) => {
try {
const { name = '', email, password } = req.body;
if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ msg: 'User already exists' });
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);
const user = await User.create({ name, email, passwordHash });
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

		const cookieOptions = {
			httpOnly: true,
			secure: process.env.COOKIE_SECURE === 'true',
			sameSite: process.env.COOKIE_SAME_SITE || 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		};

		res
			.cookie('token', token, cookieOptions)
			.json({ user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
res.status(500).json({ msg: 'Server error' });
}
});


router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
const match = await bcrypt.compare(password, user.passwordHash);
if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

		const cookieOptions = {
			httpOnly: true,
			secure: process.env.COOKIE_SECURE === 'true',
			sameSite: process.env.COOKIE_SAME_SITE || 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		};

		res
			.cookie('token', token, cookieOptions)
			.json({ user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
res.status(500).json({ msg: 'Server error' });
}
});

router.post('/logout', (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		secure: process.env.COOKIE_SECURE === 'true',
		sameSite: process.env.COOKIE_SAME_SITE || 'lax'
	});
	res.json({ ok: true });
});
// currently logged-in user
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;