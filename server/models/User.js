import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProgressSchema = new Schema({
problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
completedAt: Date
});

const UserSchema = new Schema({
name: { type: String, default: '' },
email: { type: String, required: true, unique: true },
passwordHash: { type: String, required: true },
progress: [ProgressSchema]
}, { timestamps: true });


const User = mongoose.model('User', UserSchema);
export default User;