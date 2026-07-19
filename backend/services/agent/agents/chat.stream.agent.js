import { getMolde } from "../config/llm.models.js";
import { ResponseClassifier } from "./ResponseClassifier.js";
import { StrategyFactory } from "../strategies/StrategyFactory.js";
import { PromptManager } from "./PromptManager.js";

/**
 * Streaming version of chatAgent.
 * Yields tokens iteratively instead of blocking.
 */
export const chatStreamAgent = async function* (state, signal) {
    const llm = await getMolde("chat");
    
    // Classify intent and extract artifact contract
    const classification = await ResponseClassifier.classify(state.prompt);
    // Backward compatibility if classifier returned a string (though it returns object now)
    const intent = typeof classification === 'string' ? classification : classification.intent;
    const artifactMetadata = typeof classification === 'object' ? classification : null;
    
    // Get strategy (Orthogonal to artifacts)
    const strategy = StrategyFactory.getStrategy(intent);
    
    // Build context with Redis memory and Artifact Formatting Rules
    const systemPrompt = await PromptManager.build(strategy, state.conversationId, artifactMetadata);

    // Yield the metadata contract first so the controller can send event: metadata
    if (artifactMetadata && artifactMetadata.isArtifact) {
        yield {
            type: "metadata",
            data: {
                isArtifact: true,
                artifactType: artifactMetadata.artifactType,
                language: artifactMetadata.language,
                title: artifactMetadata.title || "Generated Artifact",
                mimeType: "text/plain",
                stream: true
            }
        };
    }

    // Call LangChain stream method
    console.log(`[BACKEND][LLM] Calling llm.stream(). conversationId=${state.conversationId || 'null'}`);
    const stream = await llm.stream([
        {
            "role": "system",
            "content": systemPrompt
        },
        {
            "role": "human",
            "content": state.prompt
        }
    ], { signal });

    // Yield chunks to the controller (wrap in a token object)
    let llmChunkCount = 0;
    for await (const chunk of stream) {
        llmChunkCount++;
        if (llmChunkCount === 1) {
            console.log(`[BACKEND][LLM] First chunk received from LLM. content="${String(chunk.content).substring(0, 30)}"`);
        }
        if (chunk.content) {
            yield { type: "token", data: chunk.content };
        }
    }
    console.log(`[BACKEND][LLM] LLM stream exhausted. Total chunks=${llmChunkCount}`);
};
