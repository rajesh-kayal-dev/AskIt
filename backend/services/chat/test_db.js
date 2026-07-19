import mongoose from "mongoose";

async function run() {
    await mongoose.connect("mongodb+srv://knowrajeshkayal_db_user:7ldfmSFkO1uBfTRt@cluster0.i9p4s0v.mongodb.net/chat");

    
    
    const cid = "6a5cd0f99bb31c57f4dfaa80";
    const messages = await mongoose.connection.db.collection("messages").find({ conversationId: new mongoose.Types.ObjectId(cid) }).sort({ createdAt: 1 }).toArray();
    console.log(`\nConversation ${cid} has ${messages.length} messages:`);
    for (const m of messages) {
        console.log(`- [${m.role}] ${m.content.substring(0, 50)}...`);
    }

    const conversations = await mongoose.connection.db.collection("conversations").find({}).sort({ createdAt: -1 }).limit(5).toArray();
    console.log("Recent conversations:");
    for (const c of conversations) {
        console.log(`- ID: ${c._id}, Title: ${c.title}, Updated: ${c.updatedAt}`);
    }

    mongoose.disconnect();
}

run().catch(console.error);
