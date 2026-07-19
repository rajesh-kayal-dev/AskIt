import { jest } from '@jest/globals';
import { streamChat } from "../controllers/stream.controller.js";
import { chatStreamAgent } from "../agents/chat.stream.agent.js";
import { MemoryManager } from "../agents/MemoryManager.js";
import axios from "axios";

jest.mock("../agents/chat.stream.agent.js", () => ({
    chatStreamAgent: jest.fn()
}));
jest.mock("../agents/MemoryManager.js", () => ({
    MemoryManager: { addMessage: jest.fn() }
}));
jest.mock("axios");

describe("stream.controller.js - SSE Streaming", () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: { prompt: "Hello" },
            headers: { "x-user-id": "123" },
            on: jest.fn()
        };
        mockRes = {
            setHeader: jest.fn(),
            flushHeaders: jest.fn(),
            write: jest.fn(),
            end: jest.fn()
        };
        jest.clearAllMocks();
    });

    it("should initialize SSE headers correctly", async () => {
        chatStreamAgent.mockImplementation(async function* () { yield "Mock"; });
        
        await streamChat(mockReq, mockRes);
        
        expect(mockRes.setHeader).toHaveBeenCalledWith("Content-Type", "text/event-stream");
        expect(mockRes.flushHeaders).toHaveBeenCalled();
    });

    it("should emit start, token, and done events", async () => {
        chatStreamAgent.mockImplementation(async function* () { 
            yield "Hello"; 
            yield " World"; 
        });
        axios.post.mockResolvedValue({ data: { conversationId: "c1", title: "Test" } });

        await streamChat(mockReq, mockRes);

        expect(mockRes.write).toHaveBeenCalledWith(expect.stringContaining("event: start"));
        expect(mockRes.write).toHaveBeenCalledWith(expect.stringContaining("Hello"));
        expect(mockRes.write).toHaveBeenCalledWith(expect.stringContaining(" World"));
        expect(mockRes.write).toHaveBeenCalledWith(expect.stringContaining("event: done"));
    });

    it("should NOT persist to DB if client disconnects mid-stream", async () => {
        let abortCallback;
        mockReq.on.mockImplementation((event, cb) => {
            if (event === "close") abortCallback = cb;
        });

        chatStreamAgent.mockImplementation(async function* () { 
            yield "Part 1 "; 
            abortCallback(); // Simulate client closing browser mid-stream
            yield "Part 2 "; 
        });

        await streamChat(mockReq, mockRes);

        expect(axios.post).not.toHaveBeenCalled();
        expect(MemoryManager.addMessage).not.toHaveBeenCalled();
        expect(mockRes.end).toHaveBeenCalled();
    });
});
