import axios from "axios";
import graph from "../graph/graph.js";
import { getMolde } from "../config/llm.models.js";
import { MemoryManager } from "../agents/MemoryManager.js";

/**
 * POST /chat
 * Main agent endpoint — orchestrates the full chat flow:
 * 1. Run LangGraph (Groq AI)
 * 2. On success:
 *    - If no conversationId → call CHAT_SERVICE /internal/complete (creates conv + saves both messages)
 *    - If conversationId exists → call CHAT_SERVICE /internal/append (appends messages + bumps updatedAt)
 * 3. Return { success, response, conversationId, title?, isNew }
 * 
 * CRITICAL: No DB writes happen if AI generation fails.
 */
export const agent = async (req, res) => {
    try {
        const { prompt, conversationId } = req.body;
        const userId = req.headers["x-user-id"];

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // ── Step 1: Run LangGraph AI pipeline ──────────────────────────────
        const result = await graph.invoke({
            prompt: prompt.trim(),
            conversationId: conversationId || null
        });

        const aiResponse = result.aiResponse;

        if (!aiResponse) {
            return res.status(500).json({
                success: false,
                message: "AI did not return a response"
            });
        }

        // ── Step 2: Persist to Chat Service (only on success) ───────────────
        const isNewConversation = !conversationId;

        if (isNewConversation) {
            let aiTitle = null;
            try {
                const llm = await getMolde("chat");
                const titlePrompt = `Generate a concise, meaningful title for this conversation based on the user's intent and the overall discussion. The title should summarize the main topic, not simply repeat the first message. Use 2–5 words, in Title Case, without quotes, emojis, punctuation at the end, or prefixes like "Chat:", "Conversation:", or "About". Make the title specific and easy to recognize later. If the conversation evolves significantly, generate a title that reflects the primary topic. Avoid generic titles such as "Hi", "Help", "Question", "New Chat", or single-word titles unless they are highly descriptive. Return only the title text and nothing else.

Examples:
"what is redis" → Understanding Redis
"how jwt works in node js" → JWT Authentication Flow
"build a mern ecommerce backend" → MERN Ecommerce Backend
"fix express middleware issue" → Express Middleware Debugging
"compare redis and mongodb" → Redis vs MongoDB
"how to deploy next.js on vercel" → Deploying Next.js
"help me prepare for backend interview" → Backend Interview Preparation
"create chatgpt clone with streaming" → AI Chat Application
"optimize mysql query performance" → MySQL Query Optimization
"build authentication using oauth" → OAuth Authentication

User prompt: "${prompt.trim()}"`;

                const titleResult = await llm.invoke([{ role: "human", content: titlePrompt }]);
                aiTitle = titleResult.content.trim();
            } catch (err) {
                console.error("[agent] title generation error:", err.message);
                // Fallback to chat service's string generator
            }

            // First message — create conversation + save both messages atomically
            const chatRes = await axios.post(
                `${process.env.CHAT_SERVICE}/internal/complete`,
                {
                    userId,
                    prompt: prompt.trim(),
                    aiResponse,
                    title: aiTitle
                }
            );

            const { conversationId: newConversationId, title } = chatRes.data;

            // Push to Redis ephemeral memory
            await MemoryManager.addMessage(newConversationId, "user", prompt.trim());
            await MemoryManager.addMessage(newConversationId, "assistant", aiResponse);

            return res.status(200).json({
                success: true,
                response: aiResponse,
                conversationId: newConversationId,
                title,
                isNew: true
            });

        } else {
            // Subsequent message — append to existing conversation
            await axios.post(
                `${process.env.CHAT_SERVICE}/internal/append`,
                {
                    conversationId,
                    prompt: prompt.trim(),
                    aiResponse
                }
            );

            // Push to Redis ephemeral memory
            await MemoryManager.addMessage(conversationId, "user", prompt.trim());
            await MemoryManager.addMessage(conversationId, "assistant", aiResponse);

            return res.status(200).json({
                success: true,
                response: aiResponse,
                conversationId,
                isNew: false
            });
        }

    } catch (error) {
        console.error("[agent] error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Agent error",
            error: error.message
        });
    }
};