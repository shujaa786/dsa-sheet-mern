import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Accept token from cookie OR Bearer header OR raw header value
    const rawAuth = (req.headers.authorization || '').trim();
    const headerToken = rawAuth.startsWith('Bearer ') ? rawAuth.slice(7).trim() : (rawAuth || null);
    const token = req.cookies?.token || headerToken;

    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    // Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: 'Invalid token' });
    }

    // Support various payload key names
    const id = payload.id || payload.userId || payload._id;
    if (!id) {
      return res.status(401).json({ msg: 'Invalid token payload' });
    }

    const user = await User.findById(id).select('-passwordHash');
    if (!user) return res.status(401).json({ msg: 'Invalid token' });

    req.user = user;
    next();
  } catch (err) {
    console.error('AUTH MW unexpected error:', err);
    return res.status(401).json({ msg: 'Authentication failed' });
  }
};

