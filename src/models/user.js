import { getDb } from '../services/db.js';

export const usersCollection = () => getDb() && getDb().collection('users');