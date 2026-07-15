import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import agentRouter from './routes/agent.router.js';


const app = express();
const PORT = process.env.PORT || 8002;

app.use(express.json());


connectDB();


app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'agent-service', port: PORT });
});

app.use("/", agentRouter)

app.listen(PORT, () => {
  console.log(`Agent service running on port ${PORT}`);
});