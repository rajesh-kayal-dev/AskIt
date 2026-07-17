import jwt from 'jsonwebtoken';
import redis from '../../../shared/redis/redis.js';

export const googleCallback = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    
    const token = jwt.sign(
      { userId, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('session', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await redis.set(
      `session:${userId}`,
      JSON.stringify({
        userId: req.user._id,
        name: req.user.name || req.user.displayName,
        email: req.user.email,
        avatar: req.user.photo || req.user.picture || req.user.avatar || null
      }),
      'EX',
      7 * 24 * 60 * 60
    );

    res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (error) {
    console.error('Session storage error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies.session;
    
    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    req.logout((err) => {
      if (err) console.error('Passport logout error:', err);
    });

    res.clearCookie('jwt_token');
    res.clearCookie('session');
    res.clearCookie('connect.sid');
    res.clearCookie('auth_session');

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.clearCookie('jwt_token');
    res.clearCookie('session');
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};
