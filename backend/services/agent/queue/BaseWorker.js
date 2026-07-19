import { Worker } from "bullmq";
import { queueRedisConnection } from "./config.js";

/**
 * BaseWorker abstraction to enforce standard monitoring and error handling.
 * All specific feature workers (e.g. SearchWorker) will extend this.
 */
export class BaseWorker {
    /**
     * @param {String} queueName The name of the queue to listen to.
     * @param {Number} concurrency How many jobs to process concurrently.
     */
    constructor(queueName, concurrency = 1) {
        this.queueName = queueName;
        this.worker = new Worker(
            queueName,
            async (job) => {
                console.log(`[BaseWorker:${queueName}] Processing job ${job.id}`);
                return await this.processJob(job);
            },
            {
                connection: queueRedisConnection,
                concurrency
            }
        );

        this.attachEventListeners();
    }

    /**
     * Must be implemented by child classes.
     * @param {Object} job BullMQ Job object 
     */
    async processJob(job) {
        throw new Error("processJob() must be implemented by subclass.");
    }

    attachEventListeners() {
        this.worker.on("completed", (job, returnvalue) => {
            console.log(`[BaseWorker:${this.queueName}] Job ${job.id} completed successfully.`);
        });

        this.worker.on("failed", (job, err) => {
            console.error(`[BaseWorker:${this.queueName}] Job ${job?.id} failed after ${job?.attemptsMade} attempts. Error:`, err.message);
        });
    }

    async close() {
        await this.worker.close();
        console.log(`[BaseWorker:${this.queueName}] Shut down cleanly.`);
    }
}
