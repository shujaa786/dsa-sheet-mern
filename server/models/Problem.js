import mongoose from 'mongoose';
const { Schema } = mongoose;


const ProblemSchema = new Schema({
chapter: String,
subtopic: String,
title: String,
description: String,
youtube: String,
leetcode: String,
article: String,
level: { type: String, enum: ['Easy','Medium','Tough'], default: 'Easy' },
order: Number
}, { timestamps: true });


const Problem = mongoose.model('Problem', ProblemSchema);
export default Problem;