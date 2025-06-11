import express from 'express';
import { ObjectId } from 'mongodb';
import { contentBlocksCollection } from '../models/block.js';

const router = express.Router();
/**
 * @swagger
 * /api/admin/about:
 *   get:
 *     summary: Get about page content
 *     tags: [About]
 *     responses:
 *       200:
 *         description: About page content
 *       500:
 *         description: Internal server error
 */

router.post('/', async (req, res) => {
    const { imageUrl, text, size, linkUrl } = req.body;
    if (!imageUrl || !text || !size) return res.status(400).json({ message: 'Image URL, text, and size are required' });
    const validSizes = ['small', 'medium', 'large'];
    if (!validSizes.includes(size)) return res.status(400).json({ message: 'Invalid block size provided' });
    if (linkUrl && typeof linkUrl !== 'string') return res.status(400).json({ message: 'Link URL must be a string' });

    try {
        const blocksCollection = contentBlocksCollection();
        if (!blocksCollection) return res.status(500).json({ message: 'Database not connected' });
        const result = await blocksCollection.insertOne({ imageUrl, text, size, linkUrl: linkUrl || '' });
        res.status(201).json({ message: 'Content block added successfully', blockId: result.insertedId });
    } catch (error) {
        console.error('Error adding content block:', error);
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

router.put('/:blockId', async (req, res) => {
    const { blockId } = req.params;
    const { imageUrl, text, size, linkUrl } = req.body;
    if (!imageUrl && !text && !size && linkUrl === undefined) return res.status(400).json({ message: 'No update data provided' });
    if (size) {
        const validSizes = ['small', 'medium', 'large'];
        if (!validSizes.includes(size)) return res.status(400).json({ message: 'Invalid block size provided' });
    }
    if (linkUrl !== undefined && typeof linkUrl !== 'string') return res.status(400).json({ message: 'Link URL must be a string' });

    try {
        const blocksCollection = contentBlocksCollection();
        if (!blocksCollection) return res.status(500).json({ message: 'Database not connected' });
        if (!ObjectId.isValid(blockId)) return res.status(400).json({ message: 'Invalid block ID' });

        const updateDoc = {};
        if (imageUrl !== undefined) updateDoc.imageUrl = imageUrl;
        if (text !== undefined) updateDoc.text = text;
        if (size !== undefined) updateDoc.size = size;
        if (linkUrl !== undefined) updateDoc.linkUrl = linkUrl;

        const result = await blocksCollection.updateOne(
            { _id: new ObjectId(blockId) },
            { $set: updateDoc }
        );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Content block not found' });
        res.status(200).json({ message: 'Content block updated successfully' });
    } catch (error) {
        console.error('Error updating content block:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:blockId', async (req, res) => {
    const { blockId } = req.params;
    try {
        const blocksCollection = contentBlocksCollection();
        if (!blocksCollection) return res.status(500).json({ message: 'Database not connected' });
        if (!ObjectId.isValid(blockId)) return res.status(400).json({ message: 'Invalid block ID' });
        const result = await blocksCollection.deleteOne({ _id: new ObjectId(blockId) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Content block not found' });
        res.status(200).json({ message: 'Content block deleted successfully' });
    } catch (error) {
        console.error('Error deleting content block:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;