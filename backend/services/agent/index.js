import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(express.json());


connectDB();


app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'agent-service', port: PORT });
});

app.listen(PORT, () => {
  console.log(`Agent service running on port ${PORT}`);
});