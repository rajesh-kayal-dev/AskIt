import { chatStreamAgent } from "./agents/chat.stream.agent.js";

async function test() {
    const controller = new AbortController();
    const stream = chatStreamAgent({ prompt: "hi", conversationId: "6a5cd0f99bb31c57f4dfaa80" }, controller.signal);
    console.log("Starting stream...");
    try {
        for await (const chunk of stream) {
            console.log(chunk);
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
    console.log("Done");
}

test();
