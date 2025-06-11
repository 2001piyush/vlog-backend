import express from 'express';
import { aboutPageCollection } from '../models/about.js';

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

router.get('/', async (req, res) => {
    try {
        const aboutCollection = aboutPageCollection();
        if (!aboutCollection) return res.status(500).json({ message: 'Database not connected' });
        const aboutContent = await aboutCollection.findOne({});
        if (!aboutContent) return res.status(200).json({ title: 'About Us', content: 'Content not set yet.' });
        res.status(200).json(aboutContent);
    } catch (error) {
        console.error('Error fetching public about page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;