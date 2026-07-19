import { BaseWorker } from "../BaseWorker.js";

/**
 * Worker specifically responsible for executing Web Searches.
 */
export class SearchWorker extends BaseWorker {
    constructor() {
        // Queue name is "search-queue", concurrency is 10
        super("search-queue", 10);
    }

    async processJob(job) {
        const { query } = job.data;
        
        if (!query) throw new Error("Missing query in search job");
        
        // Simulating an external API web search (e.g., Tavily or SerpAPI)
        console.log(`[SearchWorker] Executing web search for: "${query}"`);
        
        // Mock heavy processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
            source: "SearchWorker",
            results: `Mocked web search results for: ${query}. (1) Link A, (2) Link B.`
        };
    }
}

// Instantiate and start listening immediately if this file is imported/run
export const searchWorkerInstance = new SearchWorker();
