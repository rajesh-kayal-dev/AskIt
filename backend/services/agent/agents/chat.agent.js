import { getMolde } from "../config/llm.models.js"

export const chatAgent = async (state) => {
    const llm = await getMolde("chat")
    const Systemprompt = `You are AskIt Agent Intelegent AI Assistent`
    const response = await llm.invoke([
        {
            "role": "System",
            "content": Systemprompt
        },
        {
            "role": "human",
            "content": state.prompt
        }
    ])
    return {
        ...state,
        airesponce: response.content
    };

}