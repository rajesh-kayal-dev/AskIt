import { getMolde } from "../config/llm.models.js";
import { ResponseClassifier } from "./ResponseClassifier.js";
import { StrategyFactory } from "../strategies/StrategyFactory.js";
import { PromptManager } from "./PromptManager.js";

export const chatAgent = async (state) => {
    const llm = await getMolde("chat");
    
    // 1. Classify the user's intent to pick a strategy
    const intent = await ResponseClassifier.classify(state.prompt);
    
    // 2. Get the appropriate strategy instance
    const strategy = StrategyFactory.getStrategy(intent);
    
    // 3. Build the final prompt composed of Base + Strategy Context + Redis Memory
    const systemPrompt = await PromptManager.build(strategy, state.conversationId);

    // 4. Execute the LLM
    const response = await llm.invoke([
        {
            "role": "system",
            "content": systemPrompt
        },
        {
            "role": "human",
            "content": state.prompt
        }
    ]);
    
    return {
        ...state,
        aiResponse: response.content
    };
}