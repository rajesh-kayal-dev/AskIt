export class ComparisonStrategy {
    getPrompt() {
        return `
You are using the COMPARISON strategy.
The user asked for the difference between two or more things (e.g., "X vs Y").

Guidelines:
- Start with a direct high-level summary of the core difference.
- MUST use a clear, well-formatted Markdown Table comparing the key traits (Performance, Use Cases, Complexity, etc.).
- Follow up with brief explanations of when to choose which.
- Keep it objective and factual.
`;
    }
}
