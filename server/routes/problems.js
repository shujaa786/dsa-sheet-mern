import express from 'express';
import Problem from '../models/Problem.js';


const router = express.Router();


// get all topics with subtopics
router.get('/', async (req, res) => {
try {
const topics = await Problem.find({}).sort({ order: 1 });
res.json({ topics });
} catch (err) {
res.status(500).json({ error: err.message });
}
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