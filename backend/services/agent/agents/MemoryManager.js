import Redis from "ioredis";

// Initialize Redis Client
const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    // Add retry strategy for resilience
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    }
});

redisClient.on("error", (err) => {
    console.error("[Redis] Connection Error:", err);
});

/**
 * MemoryManager acts as a storage-agnostic layer to handle ephemeral context.
 * It manages the "Active Context Window" in Redis.
 */
export class MemoryManager {
    /**
     * Gets the recent conversation history for an active session.
     * @param {String} conversationId 
     * @returns {Array} Array of message objects {role, content}
     */
    static async getContext(conversationId) {
        if (!conversationId) return [];
        
        try {
            const key = `chat_context:${conversationId}`;
            const data = await redisClient.lrange(key, 0, -1);
            return data.map(msg => JSON.parse(msg));
        } catch (error) {
            console.error("[MemoryManager] Error fetching context:", error.message);
            return []; // Fail gracefully, return empty context
        }
    }

    /**
     * Appends a new message to the active context window.
     * Limits the window to the last N messages to prevent context overflow.
     * @param {String} conversationId 
     * @param {String} role ("user" | "assistant")
     * @param {String} content 
     */
    static async addMessage(conversationId, role, content) {
        if (!conversationId) return;

        try {
            const key = `chat_context:${conversationId}`;
            const message = JSON.stringify({ role, content });
            
            // Push to list and trim to keep only the last 10 messages (5 turns)
            const pipeline = redisClient.pipeline();
            pipeline.rpush(key, message);
            pipeline.ltrim(key, -10, -1); 
            // Optional: set expiry so old temporary sessions clean themselves up
            pipeline.expire(key, 86400); // 24 hours
            
            await pipeline.exec();
        } catch (error) {
            console.error("[MemoryManager] Error adding message:", error.message);
        }
    }

    /**
     * Optional: Clear context from Redis when a user manually clears chat.
     */
    static async clear(conversationId) {
        if (!conversationId) return;
        try {
            await redisClient.del(`chat_context:${conversationId}`);
        } catch (error) {
            console.error("[MemoryManager] Error clearing context:", error.message);
        }
    }
}
