import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';
import { protect } from './middlewares/auth.middleware.js';
import { getCurrentUser } from './controllers/user.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const AUTH_SERVICE = process.env.AUTH_SERVICE;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const checkServiceHealth = async (url) => {
  try {
    const response = await fetch(`${url}/health`, { 
      method: 'GET',
      timeout: 2000 
    });
    return { status: response.status === 200 ? 'running' : 'error' };
  } catch (error) {
    return { status: 'down' };
  }
};

app.get('/health', async (req, res) => {
  const authStatus = await checkServiceHealth(AUTH_SERVICE);
  
  res.json({ 
    service: 'gateway', 
    port: PORT,
    services: {
      auth: {
        url: AUTH_SERVICE,
        port: new URL(AUTH_SERVICE).port,
        status: authStatus.status
      }
    }
  });
});

app.use('/auth', proxy(AUTH_SERVICE, {
  proxyReqPathResolver: (req) => '/api/auth' + req.url
}));

app.get('/user/me', protect, getCurrentUser);

app.use('/user', proxy(AUTH_SERVICE, {
  proxyReqPathResolver: (req) => '/api/user' + req.url
}));

app.listen(PORT, async () => {
  const authStatus = await checkServiceHealth(AUTH_SERVICE);
  
  console.log(`Gateway running on port ${PORT}`);
  console.log(`Auth service ${AUTH_SERVICE}: ${authStatus.status}`);
});