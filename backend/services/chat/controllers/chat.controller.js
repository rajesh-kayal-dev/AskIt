import * as conversationService from "../services/conversation.service.js";
import * as messageService from "../services/message.service.js";
import { Message } from "../models/message.model.js";

// ─── Helper: serialize conversation for public API ────────────────────────
// Never expose _id. Use uuid as the public identifier.
const toPublicConversation = (conv) => ({
    id: conv.uuid || conv._id?.toString(),
    title: conv.title,
    updatedAt: conv.updatedAt,
    createdAt: conv.createdAt,
});

// ─── Conversation CRUD ────────────────────────────────────────────────────

/**
 * GET /
 * List all conversations for the current user, sorted by updatedAt desc.
 * Returns uuid as id — never returns MongoDB _id.
 */
export const getConversations = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const conversations = await conversationService.listConversations(userId);

        return res.status(200).json({
            success: true,
            conversations: conversations.map(toPublicConversation)
        });
    } catch (error) {
        return res.status(500).json({ message: `get conversations error: ${error.message}` });
    }
};

/**
 * GET /:uuid
 * Unified hydration endpoint — returns both conversation metadata and all messages.
 * Used by the frontend on page load when a UUID is present in the URL.
 */
export const getConversationWithMessages = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { uuid } = req.params;

        // Verify ownership by UUID
        const conversation = await conversationService.getConversationByUUID(uuid, userId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const messages = await messageService.getMessagesByConversationId(conversation._id.toString());

        return res.status(200).json({
            success: true,
            conversation: toPublicConversation(conversation),
            messages // messages use internal conversationId which is fine — never returned to client
        });
    } catch (error) {
        return res.status(500).json({ message: `get conversation error: ${error.message}` });
    }
};

/**
 * PUT /:uuid
 * Rename a conversation (identified by public UUID).
 */
export const updateConverstation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { uuid } = req.params;
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const conversation = await conversationService.renameConversation(uuid, userId, title);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        return res.status(200).json({ success: true, conversation: toPublicConversation(conversation) });
    } catch (error) {
        return res.status(500).json({ message: `update conversation error: ${error.message}` });
    }
};

/**
 * DELETE /:uuid
 * Delete a conversation and all its messages atomically.
 */
export const deleteConverstation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { uuid } = req.params;
        const deleted = await conversationService.deleteConversation(uuid, userId);

        if (!deleted) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        return res.status(200).json({ success: true, message: "Conversation deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: `delete conversation error: ${error.message}` });
    }
};

// ─── Message Operations ───────────────────────────────────────────────────

/**
 * GET /message/:uuid
 * Get all messages for a conversation by UUID (kept for backward compatibility).
 * Prefer the unified GET /:uuid hydration endpoint for new code.
 */
export const getMessages = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { id: uuid } = req.params;

        // Verify ownership by UUID
        const conversation = await conversationService.getConversationByUUID(uuid, userId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const messages = await messageService.getMessagesByConversationId(conversation._id.toString());
        return res.status(200).json({ success: true, messages });
    } catch (error) {
        return res.status(500).json({ message: `get messages error: ${error.message}` });
    }
};

// ─── Internal Endpoints (service-to-service, no auth) ─────────────────────

/**
 * POST /internal/complete
 * Called by Agent Service after first successful AI response.
 * Atomically creates conversation + saves both messages.
 * Returns uuid (public) and title — never returns MongoDB _id.
 * 
 * Body: { userId, prompt, aiResponse, title }
 */
export const completeFirstExchange = async (req, res) => {
    try {
        const { userId, prompt, aiResponse, title } = req.body;

        if (!userId || !prompt || !aiResponse) {
            return res.status(400).json({
                message: "userId, prompt, and aiResponse are required"
            });
        }

        const { conversation, userMessage, assistantMessage } =
            await messageService.createFirstExchange(userId, prompt, aiResponse, title);

        return res.status(201).json({
            success: true,
            conversationId: conversation.uuid || conversation._id.toString(),  // PUBLIC UUID (fallback to _id if uuid generation failed)
            title: conversation.title,
            userMessage,
            assistantMessage
        });
    } catch (error) {
        console.error("[completeFirstExchange] error:", error.message);
        return res.status(500).json({ message: `complete first exchange error: ${error.message}` });
    }
};

/**
 * POST /internal/append
 * Called by Agent Service for all subsequent messages.
 * Accepts conversationId as PUBLIC UUID — resolves to ObjectId internally.
 * Agent Service stays storage-agnostic.
 * 
 * Body: { conversationId (UUID), prompt, aiResponse }
 */
export const appendToConversation = async (req, res) => {
    try {
        const { conversationId, prompt, aiResponse } = req.body;

        if (!conversationId || !prompt || !aiResponse) {
            return res.status(400).json({
                message: "conversationId, prompt, and aiResponse are required"
            });
        }

        // appendExchange handles UUID → ObjectId resolution internally
        const { userMessage, assistantMessage } =
            await messageService.appendExchange(conversationId, prompt, aiResponse);

        return res.status(201).json({
            success: true,
            userMessage,
            assistantMessage
        });
    } catch (error) {
        console.error("[appendToConversation] error:", error.message);
        return res.status(500).json({ message: `append to conversation error: ${error.message}` });
    }
};

/**
 * PUT /message/:id
 * Updates a specific message's content in the database.
 */
export const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, feedback } = req.body;
        
        const updateFields = {};
        if (content !== undefined) updateFields.content = content;
        if (feedback !== undefined) updateFields.feedback = feedback;

        const updated = await Message.findByIdAndUpdate(id, updateFields, { new: true });
        if (!updated) return res.status(404).json({ message: "Message not found" });

        return res.status(200).json({ success: true, message: updated });
    } catch (error) {
        console.error("[updateMessage] error:", error.message);
        return res.status(500).json({ message: `update message error: ${error.message}` });
    }
};
