import { StrategyFactory } from "../strategies/StrategyFactory.js";
import { SimpleStrategy } from "../strategies/SimpleStrategy.js";
import { TeachingStrategy } from "../strategies/TeachingStrategy.js";
import { DebuggingStrategy } from "../strategies/DebuggingStrategy.js";
import { ComparisonStrategy } from "../strategies/ComparisonStrategy.js";
import { RecommendationStrategy } from "../strategies/RecommendationStrategy.js";

describe("StrategyFactory", () => {
    it("should return TeachingStrategy for 'teaching' intent", () => {
        const strategy = StrategyFactory.getStrategy("teaching");
        expect(strategy).toBeInstanceOf(TeachingStrategy);
    });

    it("should return DebuggingStrategy for 'debugging' intent", () => {
        const strategy = StrategyFactory.getStrategy("debugging");
        expect(strategy).toBeInstanceOf(DebuggingStrategy);
    });

    it("should return ComparisonStrategy for 'comparison' intent", () => {
        const strategy = StrategyFactory.getStrategy("comparison");
        expect(strategy).toBeInstanceOf(ComparisonStrategy);
    });

    it("should return RecommendationStrategy for 'recommendation' intent", () => {
        const strategy = StrategyFactory.getStrategy("recommendation");
        expect(strategy).toBeInstanceOf(RecommendationStrategy);
    });

    it("should return SimpleStrategy for 'simple' intent", () => {
        const strategy = StrategyFactory.getStrategy("simple");
        expect(strategy).toBeInstanceOf(SimpleStrategy);
    });

    it("should fallback to SimpleStrategy for unknown intents", () => {
        const strategy = StrategyFactory.getStrategy("unknown_gibberish");
        expect(strategy).toBeInstanceOf(SimpleStrategy);
    });

    it("should fallback to SimpleStrategy for null or undefined intents", () => {
        expect(StrategyFactory.getStrategy(null)).toBeInstanceOf(SimpleStrategy);
        expect(StrategyFactory.getStrategy(undefined)).toBeInstanceOf(SimpleStrategy);
    });
});
