import { Queue } from "bullmq";
import { defaultQueueConfig } from "./config.js";

/**
 * Centralized QueueManager to instantiate and route jobs to queues.
 * Acts as the single entry point for any background task.
 */
class QueueManager {
    constructor() {
        this.queues = new Map();
    }

    /**
     * Retrieves an existing queue or creates it using standard defaults.
     * @param {String} queueName 
     */
    getQueue(queueName) {
        if (!this.queues.has(queueName)) {
            const queue = new Queue(queueName, defaultQueueConfig);
            this.queues.set(queueName, queue);
            console.log(`[QueueManager] Initialized Queue: ${queueName}`);
        }
        return this.queues.get(queueName);
    }

    /**
     * Adds a generic job to a specific queue.
     * @param {String} queueName 
     * @param {String} jobName 
     * @param {Object} payload 
     * @param {Object} [options] Optional overrides for idempotency (e.g. jobId)
     */
    async addJob(queueName, jobName, payload, options = {}) {
        const queue = this.getQueue(queueName);
        const job = await queue.add(jobName, payload, options);
        console.log(`[QueueManager] Added job ${job.id} to ${queueName}`);
        return job;
    }

    /**
     * Graceful shutdown of all queues.
     */
    async closeAll() {
        for (const [name, queue] of this.queues.entries()) {
            await queue.close();
            console.log(`[QueueManager] Closed Queue: ${name}`);
        }
    }
}

export const queueManager = new QueueManager();
