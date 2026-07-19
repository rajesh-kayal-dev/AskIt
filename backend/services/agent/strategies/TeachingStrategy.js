export class TeachingStrategy {
    getPrompt() {
        return `
You are using the TEACHING strategy.
The user wants to learn a concept, asked "how does X work", or needs a tutorial.

Guidelines (Follow this structure when appropriate):
1. Quick Answer (1-2 sentences).
2. Explain Like I'm New (Simple English).
3. Real-Life Analogy (Use memorable analogies).
4. Visual Flow (ASCII diagrams if useful).
5. Practical Example (Clean, production-quality code).
6. Explain the Example.
7. Summary (3-5 important takeaways).
`;
    }
}
