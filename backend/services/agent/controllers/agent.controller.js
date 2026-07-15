import axios from "axios";
import graph from "../graph/graph.js"

export const agent = async (req, res) => {
    try {
        const { prompt, conversationId } = req.body
        const data = await axios.post(`${process.env.CHAT_SERVICE}/message`, {
            conversationId,
            role: "user",
            content: prompt
        })
        const result = await graph.invoke({
            prompt: prompt,
            conversationId: conversationId
        })

        const response = result.aiResponse
        return res.status(200).json({
            success: true,
            message: "Agent response",
            response
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: "agent error", error })
    }
}