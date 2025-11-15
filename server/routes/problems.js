import express from 'express';
import Problem from '../models/Problem.js';


const router = express.Router();


// get all problems grouped by chapter
router.get('/', async (req, res) => {
const problems = await Problem.find({}).sort({ chapter: 1, order: 1 });
const grouped = problems.reduce((acc, p) => {
acc[p.chapter] = acc[p.chapter] || [];
acc[p.chapter].push(p);
return acc;
}, {});
res.json(grouped);
});


// admin create (for simplicity no auth)
router.post('/', async (req, res) => {
const p = await Problem.create(req.body);
res.json(p);
});


router.get('/:id', async (req, res) => {
const p = await Problem.findById(req.params.id);
res.json(p);
});


router.put('/:id', async (req, res) => {
const p = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(p);
});


router.delete('/:id', async (req, res) => {
await Problem.findByIdAndDelete(req.params.id);
res.json({ ok: true });
});


export default router;