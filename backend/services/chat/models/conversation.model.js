import mongoose from "mongoose";
import { type } from "node:os";

const conversationSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

export const Conversation = mongoose.model("Conversation", conversationSchema);