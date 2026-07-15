import { ChatGroq } from "@langchain/groq";
import { ChatGoogle } from "@langchain/google";

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0
});


const gemini = new ChatGoogle({
    model: "gemini-2.5-flash"
});

export const getMolde = async (agent) => {
    if (agent === "chat") {
        return groq;
    } else if (agent === "search") {
        return groq;
    } else if (agent === "codeing") {
        return gemini;
    }
    else if (agent === "ppt") {
        return gemini;
    }
    else if (agent === "imageGen") {
        return gemini;
    }
    else {
        return groq;
    }

};
