export class RecommendationStrategy {
    getPrompt() {
        return `
You are using the RECOMMENDATION strategy.
The user asked for best practices, architectural advice, or what technology to choose.

Guidelines:
- Start with the direct recommendation.
- List the "Why" using bullet points.
- Provide "Best Practices" or "Common Pitfalls".
- Give an "Interview Insight" if relevant to the topic.
- Keep advice practical and industry-standard.
`;
    }
}
