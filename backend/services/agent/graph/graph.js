import {StateGraph} from "@langchain/langgraph";
import {agentState} from "../state/state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { imageGenAgent } from "../agents/imageGen.agent.js";
import { codeingAgent } from "../agents/codeing.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";

const workflow = new StateGraph(agentState)

workflow.addNode("router", router)
workflow.addNode("chat", chatAgent)
workflow.addNode("codeing", codeingAgent)
workflow.addNode("search", searchAgent)
workflow.addNode("ppt", pptAgent)
workflow.addNode("pdf", pdfAgent)
workflow.addNode("imageGen", imageGenAgent)

workflow.addEdge("__start__", "router");
workflow.addConditionalEdges("router",(state)=>{
  const agent = state.agent

  if(agent === "chat"){
    return "chat"
  }
  if(agent === "codeing"){
    return "codeing"
  }
  if(agent === "search"){
    return "search"
  }
  if(agent === "ppt"){
    return "ppt"
  }
  if(agent === "pdf"){
    return "pdf"
  }
  if(agent === "imageGen"){
    return "imageGen"
  }
},{
    chat: "chat",
    codeing: "codeing",
    search: "search",
    ppt: "ppt",
    pdf: "pdf",
    imageGen: "imageGen", 
})
workflow.addEdge("search", "chat")
workflow.addEdge("chat", "__end__")
workflow.addEdge("codeing", "__end__")
workflow.addEdge("ppt", "__end__")
workflow.addEdge("pdf", "__end__")
workflow.addEdge("imageGen", "__end__")

const graph = workflow.compile();
