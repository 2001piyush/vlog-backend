import express from 'express';
import { ObjectId } from 'mongodb';
import { bannerImagesCollection } from '../models/banner.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'Image URL is required' });
    try {
        const bannerCollection = bannerImagesCollection();
        if (!bannerCollection) return res.status(500).json({ message: 'Database not connected' });
        const result = await bannerCollection.insertOne({ imageUrl });
        res.status(201).json({ message: 'Banner image added successfully', imageId: result.insertedId });
    } catch (error) {
        console.error('Error adding banner image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const bannerCollection = bannerImagesCollection();
        if (!bannerCollection) return res.status(500).json({ message: 'Database not connected' });
        const images = await bannerCollection.find({}).toArray();
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching banner images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:imageId', async (req, res) => {
    const { imageId } = req.params;
    try {
        const bannerCollection = bannerImagesCollection();
        if (!bannerCollection) return res.status(500).json({ message: 'Database not connected' });
        if (!ObjectId.isValid(imageId)) return res.status(400).json({ message: 'Invalid image ID' });
        const result = await bannerCollection.deleteOne({ _id: new ObjectId(imageId) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Banner image not found' });
        res.status(200).json({ message: 'Banner image deleted successfully' });
    } catch (error) {
        console.error('Error deleting banner image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;