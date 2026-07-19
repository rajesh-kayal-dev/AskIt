import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { createConversation, touchConversation, resolveUUIDToObjectId } from "./conversation.service.js";
import { generateTitle } from "../utils/generateTitle.js";

/**
 * MessageService — Repository layer for Message operations.
 */

/**
 * Save a single message.
 * @param {string} conversationId 
 * @param {string} role - 'user' | 'model' | 'assistant'
 * @param {string} content 
 * @param {import('mongoose').ClientSession} [session]
 */
export const createMessage = async (conversationId, role, content, session = null) => {
    const opts = session ? { session } : {};
    const messages = await Message.create([{ conversationId, role, content }], opts);
    return messages[0];
};

/**
 * Get all messages for a conversation, sorted chronologically (oldest first).
 * @param {string} conversationId 
 */
export const getMessagesByConversationId = async (conversationId) => {
    return Message.find({ conversationId })
        .sort({ createdAt: 1 })
        .lean();
};

/**
 * THE KEY METHOD: Create the first exchange atomically.
 * - Creates conversation with an AI-generated title
 * - Saves user message
 * - Saves AI response message
 * All in a single MongoDB transaction — if anything fails, nothing is written.
 * 
 * @param {string} userId 
 * @param {string} userPrompt  - The user's first message
 * @param {string} aiResponse  - The AI's first response
 * @returns {{ conversation, userMessage, assistantMessage }}
 */
export const createFirstExchange = async (userId, userPrompt, aiResponse, customTitle = null) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Generate a meaningful title from the first prompt
        const title = customTitle || generateTitle(userPrompt);

        // 1. Create conversation
        const conversation = await createConversation(userId, title, session);

        // 2. Save user message
        const userMessage = await createMessage(
            conversation._id.toString(),
            'user',
            userPrompt,
            session
        );

        // 3. Save AI response
        const assistantMessage = await createMessage(
            conversation._id.toString(),
            'model',
            aiResponse,
            session
        );

        await session.commitTransaction();

        return {
            conversation,
            userMessage,
            assistantMessage
        };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

/**
 * Append messages to an existing conversation.
 * Accepts a PUBLIC UUID — resolves to internal ObjectId inside this service.
 * The Agent Service never needs to know about MongoDB ObjectIds.
 * 
 * @param {string} conversationUUID  — public UUID from the done SSE event
 * @param {string} userPrompt 
 * @param {string} aiResponse 
 */
export const appendExchange = async (conversationUUID, userPrompt, aiResponse) => {
    // Resolve UUID → ObjectId (Chat Service responsibility)
    const conversationId = await resolveUUIDToObjectId(conversationUUID);
    if (!conversationId) {
        throw new Error(`Conversation not found for UUID: ${conversationUUID}`);
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const userMessage = await createMessage(conversationId, 'user', userPrompt, session);
        const assistantMessage = await createMessage(conversationId, 'model', aiResponse, session);
        await touchConversation(conversationId, session);

        await session.commitTransaction();

        return { userMessage, assistantMessage };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};
