import { jest } from '@jest/globals';
import { queueManager } from "../queue/QueueManager.js";
import { Queue } from "bullmq";

jest.mock("bullmq", () => {
    return {
        Queue: jest.fn().mockImplementation(() => ({
            add: jest.fn().mockResolvedValue({ id: "job-123" }),
            close: jest.fn().mockResolvedValue()
        }))
    };
});

describe("QueueManager", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize a new queue only once", () => {
        const q1 = queueManager.getQueue("test-queue");
        const q2 = queueManager.getQueue("test-queue");
        expect(q1).toBe(q2);
        expect(Queue).toHaveBeenCalledTimes(1);
    });

    it("should successfully add a job", async () => {
        const job = await queueManager.addJob("test-queue", "process", { data: 1 });
        expect(job.id).toBe("job-123");
    });

    it("should gracefully close all queues", async () => {
        queueManager.getQueue("close-queue");
        await expect(queueManager.closeAll()).resolves.not.toThrow();
    });
});
