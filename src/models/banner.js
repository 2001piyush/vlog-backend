import { getDb } from '../services/db.js';

export const bannerImagesCollection = () => getDb() && getDb().collection('bannerImages');