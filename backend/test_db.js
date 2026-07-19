import mongoose from "mongoose";

async function run() {
    await mongoose.connect("mongodb://localhost:27017/askit", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    // Get messages
    const messages = await mongoose.connection.db.collection("messages").find({}).sort({ createdAt: 1 }).toArray();
    
    console.log(`Total messages: ${messages.length}`);
    
    // Group by conversation
    const groups = {};
    for (const msg of messages) {
        const cid = msg.conversationId.toString();
        if (!groups[cid]) groups[cid] = [];
        groups[cid].push(msg);
    }

    for (const [cid, msgs] of Object.entries(groups)) {
        console.log(`\nConversation ${cid} has ${msgs.length} messages:`);
        for (const m of msgs) {
            console.log(`- [${m.role}] ${m.content.substring(0, 30)}...`);
        }
    }

    mongoose.disconnect();
}

run().catch(console.error);
