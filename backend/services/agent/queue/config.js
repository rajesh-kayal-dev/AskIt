import Redis from "ioredis";

// Shared Redis connection specifically optimized for BullMQ
export const queueRedisConnection = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null // BullMQ strictly requires this to be null
});

queueRedisConnection.on("error", (err) => {
    console.error("[BullMQ Redis] Connection Error:", err);
});

// Shared Default Queue Configuration
export const defaultQueueConfig = {
    connection: queueRedisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000 // 2s, 4s, 8s
        },
        removeOnComplete: {
            age: 3600, // keep for 1 hour
            count: 100 // keep max 100 jobs
        },
        removeOnFail: {
            age: 24 * 3600, // keep for 24 hours
            count: 500 // keep max 500 failed jobs for debugging
        }
    }
};
