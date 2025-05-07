// filepath: [server.js](http://_vscodecontentref_/1)
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import { connect } from './src/services/db.js';

const port = process.env.PORT || 5000;

connect().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});