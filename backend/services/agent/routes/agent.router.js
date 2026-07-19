import express from "express";
import { agent } from "../controllers/agent.controller.js";
import { streamChat } from "../controllers/stream.controller.js";

const router = express.Router();

import { queueRedisConnection } from "../queue/config.js";

router.post("/chat", agent);
router.post("/chat/stream", streamChat);

router.get("/health/queue", async (req, res) => {
    try {
        const status = await queueRedisConnection.ping();
        res.status(200).json({ status: "healthy", redis: status === "PONG" ? "connected" : "unknown" });
    } catch (error) {
        res.status(500).json({ status: "unhealthy", error: error.message });
    }
});

export default router;
