import mongoose from 'mongoose';
const { Schema } = mongoose;

const SubTopicSchema = new Schema({
_id: String,
name: String,
leetcode: String,
youtube: String,
article: String,
level: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
status: { type: String, enum: ['Pending', 'Done'], default: 'Pending' },
order: Number
}, { _id: false });

const TopicSchema = new Schema({
_id: String,
name: String,
status: { type: String, enum: ['Pending', 'Done'], default: 'Pending' },
order: Number,
subTopics: [SubTopicSchema]
}, { _id: false });

const Problem = mongoose.model('Problem', TopicSchema);
export default Problem;