import { getDb } from '../services/db.js';
export const adminCollection = () => getDb() && getDb().collection('admin');
