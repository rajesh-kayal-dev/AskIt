export const createConverstation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const conversation = await Conversation.create({
            userId: userId,
            title: "New Chat"
        })

        return res.status(201).json(conversation)
    } catch (error) {
        return res.status(500).json({ message: `create conversation error ${error.message}` })
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const conversations = await Conversation.find({
            userId: userId
        }).sort({ updatedAt: -1 })

        return res.status(200).json(conversations)
    } catch (error) {
        return res.status(500).json({ message: `get converstation error ${error.message}` })
    }
}

export const updateConverstation = async (req, res) => {
    try {
        const { id, title } = req.body;
        if (!id || !title) {
            return res.status(400).json({ message: "Bad request" })
        }
        const conversation = await Conversation.findByIdAndUpdate(id,
            { title: title },
            { new: true }
        )
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" })
        }
        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json({ message: `update conversation error ${error.message}` })
    }
}

export const deleteConverstation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const conversationId = req.params.id;
        if (!conversationId) {
            return res.status(400).json({ message: "Bad request" })
        }

        const conversation = await Conversation.findOneAndDelete({
            _id: conversationId,
            userId: userId
        })

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" })
        }

        return res.status(200).json({ message: "Conversation deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: `delete conversation error ${error.message}` })
    }
}


export const saveMessage = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { conversationId, role, content } = req.body;
        if (!conversationId || !role || !content) {
            return res.status(400).json({ message: "Bad request" })
        }

        const message = await Message.create({
            conversationId: conversationId,
            role: role,
            content: content
        })

        return res.status(201).json(message)
    } catch (error) {
        return res.status(500).json({ message: `save message error ${error.message}` })
    }
}
export const getMessages = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const messages = await Message.find({
            conversationId: req.params.id
        }).sort({ createdAt: -1 })

        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ message: `get messages error ${error.message}` })
    }
}