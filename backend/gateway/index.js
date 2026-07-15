import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';
import { protect } from './middlewares/auth.middleware.js';
import { getCurrentUser } from './controllers/user.controller.js';
import proxyWithHeader from './utils/proxyWithHeader.js';
import healthRoutes from './routes/health.route.js';
import { logServiceStatuses } from './controllers/health.controller.js';

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/auth", proxy(process.env.AUTH_SERVICE, {
    proxyReqPathResolver: (req) => {
        return '/api/auth' + req.url;
    }
}));
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE));
app.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE));
app.get("/api/me", protect, getCurrentUser);

app.get("/", (req, res) => {
    res.json({ message: "hello from gateway" });
});

app.listen(port, async () => {
    console.log(`gateway started at ${port}`);
    await logServiceStatuses();
});