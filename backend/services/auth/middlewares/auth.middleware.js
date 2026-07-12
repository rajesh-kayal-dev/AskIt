import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const authenticateToken = async (req, res, next) => {
  if (req.isAuthenticated?.()) {
    return next();
  }

  const authHeaderToken = req.headers.authorization?.split(' ')[1];
  const cookieToken = req.cookies?.jwt_token;
  const token = authHeaderToken || cookieToken;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
