import { jest } from '@jest/globals';
import { ResponseClassifier } from "../agents/ResponseClassifier.js";
import * as llmModels from "../config/llm.models.js";

// Mock the LLM config
jest.mock("../config/llm.models.js", () => ({
    getMolde: jest.fn()
}));

describe("ResponseClassifier", () => {
    let mockInvoke;

    beforeEach(() => {
        mockInvoke = jest.fn();
        llmModels.getMolde.mockResolvedValue({ invoke: mockInvoke });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should correctly classify a teaching intent", async () => {
        mockInvoke.mockResolvedValue({ content: "teaching" });
        
        const intent = await ResponseClassifier.classify("explain how nodejs works");
        
        expect(intent).toBe("teaching");
        expect(mockInvoke).toHaveBeenCalled();
    });

    it("should fallback to 'simple' if LLM returns an invalid intent", async () => {
        mockInvoke.mockResolvedValue({ content: "invalid_intent" });
        
        const intent = await ResponseClassifier.classify("do something weird");
        
        expect(intent).toBe("simple");
    });

    it("should handle LLM whitespace/newline responses properly", async () => {
        mockInvoke.mockResolvedValue({ content: "  \n DeBugging \t " });
        
        const intent = await ResponseClassifier.classify("fix this code");
        
        expect(intent).toBe("debugging");
    });

    it("should fallback to 'simple' if the LLM throws an error", async () => {
        mockInvoke.mockRejectedValue(new Error("API Timeout"));
        
        const intent = await ResponseClassifier.classify("what is 2+2");
        
        expect(intent).toBe("simple");
    });
});
