import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const conversationSchema = new mongoose.Schema({ uuid: String, title: String, userId: mongoose.Schema.Types.ObjectId }, { timestamps: true });
const Conversation = mongoose.model('Conversation', conversationSchema);

async function migrate() {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    const all = await Conversation.find({});
    console.log('Total conversations:', all.length);
    let updated = 0;
    for (const conv of all) {
        if (!conv.uuid) {
            const newUUID = randomUUID();
            await Conversation.updateOne({ _id: conv._id }, { uuid: newUUID });
            console.log('Updated:', conv._id.toString(), '->', newUUID);
            updated++;
        } else {
            console.log('Already has UUID:', conv._id.toString(), conv.uuid);
        }
    }
    console.log('Migration complete. Updated:', updated, 'of', all.length);
    await mongoose.disconnect();
}
migrate().catch(e => { console.error(e); process.exit(1); });
