import express from 'express';
import { aboutPageCollection } from '../models/about.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const aboutCollection = aboutPageCollection();
        if (!aboutCollection) return res.status(500).json({ message: 'Database not connected' });
        const aboutContent = await aboutCollection.findOne({});
        if (!aboutContent) return res.status(200).json({ title: '', content: '' });
        res.status(200).json(aboutContent);
    } catch (error) {
        console.error('Error fetching admin about page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/', async (req, res) => {
    const { title, content } = req.body;
    if (title === undefined || content === undefined) return res.status(400).json({ message: 'Title and content are required' });
    try {
        const aboutCollection = aboutPageCollection();
        if (!aboutCollection) return res.status(500).json({ message: 'Database not connected' });
        const result = await aboutCollection.updateOne(
            {},
            { $set: { title, content } },
            { upsert: true }
        );
        if (result.matchedCount === 0 && result.upsertedCount === 0) {
            return res.status(500).json({ message: 'Failed to save about page content.' });
        }
        res.status(200).json({ message: 'About page content updated successfully' });
    } catch (error) {
        console.error('Error updating about page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;