import { getDb } from '../services/db.js';

export const contentBlocksCollection = () => getDb() && getDb().collection('contentBlocks');