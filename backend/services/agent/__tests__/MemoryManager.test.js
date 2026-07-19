import { jest } from '@jest/globals';
import { MemoryManager } from "../agents/MemoryManager.js";
import Redis from "ioredis";

describe("MemoryManager Integration & Fallback Tests", () => {
    let mockPipeline;

    beforeEach(() => {
        mockPipeline = {
            rpush: jest.fn(),
            ltrim: jest.fn(),
            expire: jest.fn(),
            exec: jest.fn().mockResolvedValue(true)
        };

        Redis.prototype.pipeline = jest.fn(() => mockPipeline);
        Redis.prototype.lrange = jest.fn();
        Redis.prototype.del = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should gracefully return empty array when Redis is unavailable (Fallback Behavior)", async () => {
        Redis.prototype.lrange.mockRejectedValue(new Error("Redis connection failed"));
        
        const context = await MemoryManager.getContext("mock_conversation_id");
        
        expect(context).toEqual([]);
    });

    it("should correctly store context and enforce trimming to 10 messages", async () => {
        await MemoryManager.addMessage("mock_conv", "user", "Hello");

        expect(mockPipeline.rpush).toHaveBeenCalledWith("chat_context:mock_conv", JSON.stringify({ role: "user", content: "Hello" }));
        expect(mockPipeline.ltrim).toHaveBeenCalledWith("chat_context:mock_conv", -10, -1);
        expect(mockPipeline.expire).toHaveBeenCalledWith("chat_context:mock_conv", 86400);
        expect(mockPipeline.exec).toHaveBeenCalled();
    });

    it("should not crash when attempting to store message if Redis is down", async () => {
        mockPipeline.exec.mockRejectedValue(new Error("Redis timeout"));
        
        await expect(MemoryManager.addMessage("mock_conv", "user", "Fail")).resolves.not.toThrow();
    });

    it("should retrieve stored context and parse JSON correctly", async () => {
        Redis.prototype.lrange.mockResolvedValue([
            JSON.stringify({ role: "user", content: "Hi" }),
            JSON.stringify({ role: "assistant", content: "Hello" })
        ]);

        const context = await MemoryManager.getContext("mock_conv");
        
        expect(context).toHaveLength(2);
        expect(context[0].role).toBe("user");
        expect(context[1].role).toBe("assistant");
    });
});
