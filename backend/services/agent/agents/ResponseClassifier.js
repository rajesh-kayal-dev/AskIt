import { getMolde } from "../config/llm.models.js";

/**
 * Classifies a chat prompt into a specific sub-intent strategy.
 * Allowed strategies: simple, teaching, debugging, comparison, recommendation
 */
export class ResponseClassifier {
    static async classify(prompt) {
        try {
            // We use a small/fast model for routing if available, fallback to chat
            const llm = await getMolde("router"); 
            
            const systemInstruction = `You are a sub-intent classifier for a chat application.
Analyze the user's prompt and return a JSON object with the following fields:

1. "intent": Exactly ONE of: "simple", "teaching", "debugging", "comparison", "recommendation".
2. "isArtifact": Boolean. Set to true ONLY IF the user is explicitly asking for a large, standalone piece of structured content like a complete code file, a long document/article, or a Mermaid diagram. Do NOT set to true for short snippets or conversational answers.
3. "artifactType": If isArtifact is true, choose one of: "code", "markdown", "mermaid". Otherwise null.
4. "language": If artifactType is "code", specify the language (e.g. "javascript", "python"). Otherwise null.

Return ONLY valid JSON. No markdown wrappers.`;

            const response = await llm.invoke([
                { role: "system", content: systemInstruction },
                { role: "human", content: prompt }
            ]);

            let parsed;
            try {
                const text = response.content.trim().replace(/^```json/, '').replace(/```$/, '');
                parsed = JSON.parse(text);
            } catch (e) {
                parsed = { intent: "simple", isArtifact: false };
            }

            const validIntents = ["simple", "teaching", "debugging", "comparison", "recommendation"];
            
            if (!validIntents.includes(parsed.intent)) {
                parsed.intent = "simple";
            }
            
            return parsed;
        } catch (error) {
            console.error("[ResponseClassifier] Error classifying prompt:", error.message);
            return { intent: "simple", isArtifact: false, artifactType: null, language: null };
        }
    }
}
