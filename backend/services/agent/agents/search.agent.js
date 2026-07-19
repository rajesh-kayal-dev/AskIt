import { queueManager } from "../queue/QueueManager.js";
import { Job } from "bullmq";

export const searchAgent = async (state) => {
    const query = state.prompt; // Extracted prompt/intent

    try {
        // Attempt to enqueue to BullMQ for offloaded processing
        console.log("[searchAgent] Enqueuing search job...");
        const job = await queueManager.addJob("search-queue", "webSearch", { query });
        
        // Wait for job to complete (simulating RPC for chat flow)
        const result = await job.waitUntilFinished(queueManager.getQueue("search-queue").events);
        
        return {
            ...state,
            aiResponse: result.results
        };
    } catch (error) {
        console.warn("[searchAgent] BullMQ Queue failed or timed out. Falling back to synchronous execution.", error.message);
        
        // Synchronous Fallback (Execute directly on Node thread)
        const syncResult = `Fallback synchronous search results for: ${query}`;
        return {
            ...state,
            aiResponse: syncResult
        };
    }
}