import express from 'express';
import bcrypt from 'bcrypt';
import { usersCollection } from '../models/user.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const trimmedUsername = username.trim();
    try {
        const userCollection = usersCollection();
        if (!userCollection) return res.status(500).json({ message: 'Database not connected' });

        const  user =  await userCollection.findOne({ username: trimmedUsername });

        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.userId = user._id;
            req.session.save(err => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.status(500).json({ message: 'Error saving session' });
                }
                res.status(200).json({ message: 'Login successful', userId: user._id });
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/dashboard', (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!', userId: req.session.userId });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});

export default router;