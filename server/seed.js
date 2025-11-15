import 'dotenv/config';
import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';


const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_sheet';


const problems = [
{ chapter: 'Arrays', subtopic: 'Two pointers', title: 'Two Sum', level: 'Easy', leetcode: 'https://leetcode.com/problems/two-sum', youtube: '', article: '', order: 1 },
{ chapter: 'Arrays', subtopic: 'Sliding Window', title: 'Maximum Subarray', level: 'Medium', leetcode: 'https://leetcode.com/problems/maximum-subarray', youtube: '', article: '', order: 2 },
{ chapter: 'Linked List', subtopic: 'Basics', title: 'Reverse Linked List', level: 'Easy', leetcode: 'https://leetcode.com/problems/reverse-linked-list', order: 1 }
];


async function seed() {
await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
await Problem.deleteMany({});
await Problem.insertMany(problems);
await User.deleteMany({});
const passwordHash = await bcrypt.hash('password123', 10);
await User.create({ name: 'Demo User', email: 'test@demo.com', passwordHash });
console.log('Seed complete. Test user: test@demo.com / password123');
process.exit(0);
}


seed().catch(err => { console.error(err); process.exit(1); });