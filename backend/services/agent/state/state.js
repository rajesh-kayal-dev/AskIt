import {Annotation} from "@langgraph/langgraph/prebuilt";

export const agentState = Annotation.root({
    prompt: Annotation(),
    aiResponse: Annotation(),
    agent:Annotation(),
    conversationId:Annotation()
})