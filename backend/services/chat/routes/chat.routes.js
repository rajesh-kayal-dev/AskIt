import express from "express";
import {
    createConverstation,
    getConversations,
    updateConverstation,
    deleteConverstation,
    saveMessage,
    getMessages,
} from "../controllers/chat.controller.js";


const router = express.Router();

router.post("/", createConverstation);
router.get("/", getConversations);
router.put("/:id", updateConverstation);
router.delete("/:id", deleteConverstation);
router.post("/message", saveMessage);
router.get("/message/:id", getMessages);



export default router;
