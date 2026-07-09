import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  picture: { type: String, default: '' },
  credits: { type: Number, default: 100 },
  plan: { type: String, enum: ['free', 'starter', 'pro'], default: 'free' },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);