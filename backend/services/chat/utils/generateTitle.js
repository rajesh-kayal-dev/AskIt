/**
 * generateTitle.js
 * Generates a meaningful conversation title from the user's first prompt.
 * Fast, free, no LLM call needed for title generation.
 */

// Common filler words to skip when building the title
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'about',
    'how', 'why', 'when', 'where', 'what', 'who', 'which', 'can', 'i',
    'me', 'my', 'you', 'your', 'we', 'our', 'it', 'its', 'this', 'that',
    'and', 'or', 'but', 'so', 'if', 'not', 'no', 'yes', 'please', 'help',
    'tell', 'show', 'give', 'make', 'let', 'get', 'want', 'need', 'like'
]);

/**
 * Generate a meaningful title from the first prompt.
 * Examples:
 *   "what is redis cache invalidation?" → "Redis Cache Invalidation"
 *   "explain how JWT authentication works in node.js" → "JWT Authentication In Node.js"
 *   "help me build a REST API" → "Build a REST API"
 * 
 * @param {string} prompt - The user's first message
 * @param {number} maxWords - Maximum words in the title (default 6)
 * @returns {string} - A meaningful title, max ~50 chars
 */
export const generateTitle = (prompt, maxWords = 6) => {
    if (!prompt || typeof prompt !== 'string') return 'New Chat';

    // Clean the prompt: remove leading question words, trim
    const cleaned = prompt
        .trim()
        .replace(/^(please\s+|hey\s+|hi\s+|hello\s+|can\s+you\s+|could\s+you\s+)/i, '')
        .replace(/[?!]+$/, '')   // remove trailing ? !
        .replace(/\s+/g, ' ');   // collapse whitespace

    if (!cleaned) return 'New Chat';

    const words = cleaned.split(' ');
    
    // Build title by taking up to maxWords meaningful words
    const titleWords = [];
    let skippedCount = 0;

    for (const word of words) {
        if (titleWords.length >= maxWords) break;
        
        const lower = word.toLowerCase().replace(/[^a-z0-9]/gi, '');
        if (!lower) continue;

        // Allow stop words after we have at least 2 meaningful words
        if (STOP_WORDS.has(lower) && titleWords.length < 2 && skippedCount < 3) {
            skippedCount++;
            continue;
        }

        titleWords.push(word);
    }

    if (titleWords.length === 0) {
        // Fallback: just take first 6 words as-is
        return words.slice(0, maxWords).join(' ').replace(/[?!]+$/, '');
    }

    // Capitalize first letter of the title
    const raw = titleWords.join(' ');
    const title = raw.charAt(0).toUpperCase() + raw.slice(1);

    // Final safety: truncate at 60 characters
    return title.length > 60 ? title.substring(0, 57).trim() + '...' : title;
};
