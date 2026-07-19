import { SimpleStrategy } from "./SimpleStrategy.js";
import { TeachingStrategy } from "./TeachingStrategy.js";
import { DebuggingStrategy } from "./DebuggingStrategy.js";
import { ComparisonStrategy } from "./ComparisonStrategy.js";
import { RecommendationStrategy } from "./RecommendationStrategy.js";

/**
 * Factory to instantiate the correct strategy based on intent.
 */
export class StrategyFactory {
    static getStrategy(intent) {
        switch (intent) {
            case "teaching":
                return new TeachingStrategy();
            case "debugging":
                return new DebuggingStrategy();
            case "comparison":
                return new ComparisonStrategy();
            case "recommendation":
                return new RecommendationStrategy();
            case "simple":
            default:
                return new SimpleStrategy();
        }
    }
}
