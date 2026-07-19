import { PromptManager } from "../agents/PromptManager.js";
import { BasePrompt } from "../strategies/BasePrompt.js";

describe("PromptManager", () => {
    it("should compose the BasePrompt with the strategy prompt", async () => {
        const mockStrategy = {
            getPrompt: () => "MOCK_STRATEGY_PROMPT"
        };

        const finalPrompt = await PromptManager.build(mockStrategy);

        expect(finalPrompt).toContain(BasePrompt);
        expect(finalPrompt).toContain("## Current Strategy Context");
        expect(finalPrompt).toContain("MOCK_STRATEGY_PROMPT");
    });

    it("should not fail if strategy prompt is empty", async () => {
        const mockStrategy = {
            getPrompt: () => ""
        };

        const finalPrompt = await PromptManager.build(mockStrategy);

        expect(finalPrompt).toContain(BasePrompt);
        expect(finalPrompt).toContain("## Current Strategy Context");
    });
});
