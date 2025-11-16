import mongoose from 'mongoose';
const { Schema } = mongoose;

const CompletedSchema = new Schema({
problemId: String,
completedAt: Date
}, { _id: false });

const ProgressSchema = new Schema({
userId: String,
completed: [CompletedSchema]
}, { _id: false });

const UserSchema = new Schema({
_id: String,
name: { type: String, default: '' },
email: { type: String, required: true, unique: true },
passwordHash: { type: String, required: true },
userProgress: ProgressSchema
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;