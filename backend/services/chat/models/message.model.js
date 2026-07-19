import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ["user", "model", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        enum: ["like", "dislike", null],
        default: null
    }
}, {
    timestamps: true
})

export const Message = mongoose.model("Message", messageSchema);