import { getDb } from '../services/db.js';
export const User= () => getDb() && getDb().collection('users');
