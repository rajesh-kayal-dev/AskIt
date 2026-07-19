import express from "express";
import {
    getConversations,
    getConversationWithMessages,
    updateConverstation,
    deleteConverstation,
    getMessages,
    completeFirstExchange,
    appendToConversation,
    updateMessage,
} from "../controllers/chat.controller.js";

const router = express.Router();

// ─── Internal routes (service-to-service, called by Agent Service) ─────────
// MUST be defined before /:uuid to avoid route conflicts
router.post("/internal/complete", completeFirstExchange);
router.post("/internal/append", appendToConversation);

// ─── Conversation CRUD ─────────────────────────────────────────────────────
router.get("/", getConversations);
router.get("/:uuid", getConversationWithMessages);  // Unified hydration endpoint
router.put("/:uuid", updateConverstation);
router.delete("/:uuid", deleteConverstation);

// ─── Message Operations (backward compat) ─────────────────────────────────
router.get("/message/:id", getMessages);
router.put("/message/:id", updateMessage);

export default router;

