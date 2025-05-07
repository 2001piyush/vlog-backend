import express from 'express';
import { ObjectId } from 'mongodb';
import { contentBlocksCollection } from '../models/block.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const blocksCollection = contentBlocksCollection();
        if (!blocksCollection) return res.status(500).json({ message: 'Database not connected' });
        const blocks = await blocksCollection.find({}).toArray();
        res.status(200).json(blocks);
    } catch (error) {
        console.error('Error fetching public content blocks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:blockId', async (req, res) => {
    const { blockId } = req.params;
    try {
        const blocksCollection = contentBlocksCollection();
        if (!blocksCollection) return res.status(500).json({ message: 'Database not connected' });
        if (!ObjectId.isValid(blockId)) return res.status(400).json({ message: 'Invalid block ID' });
        const block = await blocksCollection.findOne({ _id: new ObjectId(blockId) });
        if (!block) return res.status(404).json({ message: 'Content block not found' });
        res.status(200).json(block);
    } catch (error) {
        console.error('Error fetching content block:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;