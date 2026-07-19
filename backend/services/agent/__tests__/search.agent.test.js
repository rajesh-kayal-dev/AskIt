import { jest } from '@jest/globals';
import { searchAgent } from "../agents/search.agent.js";
import { queueManager } from "../queue/QueueManager.js";

jest.mock("../queue/QueueManager.js", () => ({
    queueManager: {
        addJob: jest.fn(),
        getQueue: jest.fn()
    }
}));

describe("search.agent.js - BullMQ Migration", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully route search through BullMQ", async () => {
        const mockWait = jest.fn().mockResolvedValue({ results: "Queue Results" });
        queueManager.addJob.mockResolvedValue({
            waitUntilFinished: mockWait
        });
        queueManager.getQueue.mockReturnValue({ events: {} });

        const state = { prompt: "Test Search" };
        const result = await searchAgent(state);

        expect(queueManager.addJob).toHaveBeenCalledWith("search-queue", "webSearch", { query: "Test Search" });
        expect(result.aiResponse).toBe("Queue Results");
    });

    it("should gracefully fallback to synchronous execution if BullMQ fails", async () => {
        queueManager.addJob.mockRejectedValue(new Error("Redis Timeout"));

        const state = { prompt: "Fallback Search" };
        const result = await searchAgent(state);

        expect(result.aiResponse).toBe("Fallback synchronous search results for: Fallback Search");
    });
});
