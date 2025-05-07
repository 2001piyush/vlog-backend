import { getDb } from '../services/db.js';

export const aboutPageCollection = () => getDb() && getDb().collection('aboutPage');