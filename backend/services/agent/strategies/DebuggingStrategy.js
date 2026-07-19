export class DebuggingStrategy {
    getPrompt() {
        return `
You are using the DEBUGGING strategy.
The user provided an error message, broken code, or asked why something isn't working.

Guidelines (Follow this structure):
1. Root Cause: Directly identify the issue.
2. Why it happened: Brief explanation of the mechanism.
3. Correct Solution: The conceptual fix.
4. Corrected Code: Provide the fixed code.
5. Prevention Tips: How to avoid this in the future.
`;
    }
}
