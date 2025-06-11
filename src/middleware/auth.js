export const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        console.log("authentication ")
        next();
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};