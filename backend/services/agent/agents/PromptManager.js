import { BasePrompt } from "../strategies/BasePrompt.js";
import { MemoryManager } from "./MemoryManager.js";

/**
 * Manages the construction of the final LLM prompt.
 * It combines the BasePrompt, Strategy, Redis conversation context, 
 * Tool Context (future), and User Message.
 */
export class PromptManager {
    /**
     * Builds the final system prompt string asynchronously.
     * @param {Object} strategy The instantiated strategy object.
     * @param {String} conversationId The active conversation ID for memory fetching.
     * @param {Object} artifactMetadata Optional metadata defining the artifact contract.
     * @returns {Promise<String>} The fully composed system prompt.
     */
    static async build(strategy, conversationId, artifactMetadata = null) {
        let finalPrompt = BasePrompt + "\n\n";
        
        finalPrompt += "## Current Strategy Context\n";
        finalPrompt += strategy.getPrompt() + "\n\n";

        // Inject Redis Memory Context
        const history = await MemoryManager.getContext(conversationId);
        if (history && history.length > 0) {
            finalPrompt += "## Chat History Context\n";
            finalPrompt += "Below is the recent conversation history for context. Do not repeat the history, just use it to understand references.\n\n";
            history.forEach(msg => {
                finalPrompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
            });
            finalPrompt += "\n";
        }

        // Inject Artifact Presentation Rules orthogonally
        if (artifactMetadata && artifactMetadata.isArtifact) {
            finalPrompt += "## Artifact Formatting Rules\n";
            finalPrompt += `You have been requested to generate an artifact of type: ${artifactMetadata.artifactType}. `;
            if (artifactMetadata.language) finalPrompt += `Language: ${artifactMetadata.language}. `;
            finalPrompt += `\nCRITICAL: You must output ONLY the raw content of the artifact. Do NOT wrap it in markdown code blocks (\`\`\`). Do NOT include conversational filler, pleasantries, or explanations before or after the artifact. The entire stream will be rendered directly into a dedicated ${artifactMetadata.artifactType} canvas.\n\n`;
        }

        // Future: Inject Tool Context here

        return finalPrompt;
    }
}
