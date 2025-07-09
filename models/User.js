import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'alumni'], default: 'student' },

    // New fields 👇
    bio: { type: String, default: '' },
    department: { type: String },
    batch: { type: String }, // e.g. 2021-2025
    company: { type: String }, // for alumni
    profilePic: { type: String },// will store Cloudinary URL or filename
    profilePicId: { type: String }, 

    // Social
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

