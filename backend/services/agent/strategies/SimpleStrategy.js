export class SimpleStrategy {
    getPrompt() {
        return `
You are using the SIMPLE strategy.
The user asked a basic question, a greeting, or wants a short factual answer.

Guidelines:
- Provide a Quick Answer (1-2 sentences).
- Provide a Short Explanation if necessary.
- Provide a Small Example ONLY if it helps clarify.
- Do NOT add unnecessary headings or filler text.
`;
    }
}
