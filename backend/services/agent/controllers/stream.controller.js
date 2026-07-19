import axios from "axios";
import { chatStreamAgent } from "../agents/chat.stream.agent.js";
import { MemoryManager } from "../agents/MemoryManager.js";
import { getMolde } from "../config/llm.models.js";

/**
 * POST /chat/stream
 * Handles SSE connections for real-time text streaming.
 */
export const streamChat = async (req, res) => {
    // Set headers for Server-Sent Events
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const { prompt, conversationId, messageId } = req.body;
    const userId = req.headers["x-user-id"];

    console.log(`\n\n============================================================`);
    console.log(`[BACKEND][6] stream.controller received request. conversationId=${conversationId || 'null'} userId=${userId} prompt="${String(prompt).substring(0, 40)}"`);

    if (!prompt || !prompt.trim() || !userId) {
        res.write(`event: error\ndata: ${JSON.stringify({ message: "Unauthorized or Missing Prompt" })}\n\n`);
        return res.end();
    }

    const abortController = new AbortController();
    let isClientDisconnected = false;
    let bufferedResponse = "";

    // Handle client disconnect gracefully
    res.on("close", () => {
        isClientDisconnected = true;
        abortController.abort(); // Kills LLM generation to save costs
        console.log(`[SSE] Client disconnected. Aborted generation for conv: ${conversationId}`);
    });

    try {
        // Send 'start' event
        res.write(`event: start\ndata: {}\n\n`);
        console.log(`[BACKEND][6b] Sent start event. Starting chatStreamAgent...`);

        const state = { prompt: prompt.trim(), conversationId };
        
        // Execute generator
        const stream = chatStreamAgent(state, abortController.signal);

        for await (const payload of stream) {
            if (isClientDisconnected) break;
            
            if (typeof payload === 'object' && payload.type === 'metadata') {
                console.log(`[BACKEND][7b] Yielding metadata payload`);
                res.write(`event: metadata\ndata: ${JSON.stringify(payload.data)}\n\n`);
            } else if (typeof payload === 'object' && payload.type === 'token') {
                if (bufferedResponse.length === 0) {
                    console.log(`[BACKEND][8] Yielding FIRST token to client`);
                }
                bufferedResponse += payload.data;
                res.write(`event: token\ndata: ${JSON.stringify({ text: payload.data })}\n\n`);
            } else if (typeof payload === 'string') {
                // Fallback for raw string yields
                bufferedResponse += payload;
                res.write(`event: token\ndata: ${JSON.stringify({ text: payload })}\n\n`);
            }
        }

        console.log(`[BACKEND][8b] Stream generator exhausted. bufferedResponse.length=${bufferedResponse.length}`);

        if (isClientDisconnected) {
            // Do not persist partial messages unless explicitly handled
            return res.end();
        }

        // --- Stream Completed Successfully. Proceed with DB Persistence ---
        
        let newConversationId = conversationId; // conversationId is always UUID once set
        let aiTitle = null;

        if (messageId) {
            console.log(`[SSE] Calling PUT message/update for messageId: ${messageId}`);
            try {
                const updateRes = await axios.put(`${process.env.CHAT_SERVICE}/message/${messageId}`, {
                    content: bufferedResponse
                });
                console.log(`[SSE] message update SUCCESS. Response:`, updateRes.data);
            } catch (err) {
                console.error(`[SSE] message update FAILED:`, err.response?.data || err.message);
                throw err;
            }
        } else if (!conversationId) {
            // First exchange: generate title and create conversation
            try {
                const llm = await getMolde("chat");
                const titlePrompt = `Generate a concise title for: "${prompt.trim()}"`;
                const titleResult = await llm.invoke([{ role: "human", content: titlePrompt }]);
                aiTitle = titleResult.content.trim();
            } catch (err) {
                console.warn("[SSE] Title generation failed", err.message);
            }

            // Create conversation in Chat Service — returns UUID (never ObjectId)
            const chatRes = await axios.post(`${process.env.CHAT_SERVICE}/internal/complete`, {
                userId,
                prompt: prompt.trim(),
                aiResponse: bufferedResponse,
                title: aiTitle
            });
            // conversationId from chat service is now UUID
            newConversationId = chatRes.data.conversationId;
            aiTitle = chatRes.data.title;
        } else {
            console.log(`\n\n[SSE] --- STREAM COMPLETED ---`);
            console.log(`[SSE] Calling internal/append for UUID: ${conversationId}`);
            console.log(`[SSE] userMessage length: ${prompt.trim().length}`);
            console.log(`[SSE] bufferedResponse length: ${bufferedResponse.length}`);
            console.log(`[SSE] bufferedResponse preview: ${bufferedResponse.substring(0, 100).replace(/\n/g, ' ')}...`);
            try {
                // Agent Service sends UUID — Chat Service resolves to ObjectId internally
                const appendRes = await axios.post(`${process.env.CHAT_SERVICE}/internal/append`, {
                    conversationId, // this is UUID
                    prompt: prompt.trim(),
                    aiResponse: bufferedResponse
                });
                console.log(`[SSE] internal/append SUCCESS. Response:`, appendRes.data);
            } catch (err) {
                console.error(`[SSE] internal/append FAILED:`, err.response?.data || err.message);
                throw err;
            }
        }

        // Push to Redis ephemeral memory — use UUID as the key
        await MemoryManager.addMessage(newConversationId, "user", prompt.trim());
        await MemoryManager.addMessage(newConversationId, "assistant", bufferedResponse);

        // Send 'done' event — conversationId here is always UUID (never ObjectId)
        res.write(`event: done\ndata: ${JSON.stringify({ conversationId: newConversationId, title: aiTitle })}\n\n`);
        res.end();

    } catch (error) {
        if (error.name === "AbortError") {
            console.error("\n\n[SSE] !!! ABORT ERROR THROWN !!!");
            console.error("[SSE] Stack trace:", error.stack);
            console.log("[SSE] Stream aborted internally.");
        } else {
            console.error("[SSE] Stream Error:", error.message);
            res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
        }
        res.end();
    }
};
