import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/chat.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'chat-service', port: PORT });
});

app.use("/", router)

connectDB();

app.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
});