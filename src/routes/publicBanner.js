import express from 'express';
import { bannerImagesCollection } from '../models/banner.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bannerCollection = bannerImagesCollection();
        if (!bannerCollection) return res.status(500).json({ message: 'Database not connected' });
        const images = await bannerCollection.find({}, { projection: { _id: 0 } }).toArray();
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching public banner images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;