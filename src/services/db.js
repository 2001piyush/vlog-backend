import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGO_URI ;
console.log('MONGO_URI:', uri);
const client = new MongoClient(process.env.MONGO_URI, {
    tls: true,
    family: 4 // Force IPv4
  });
let db;

export async function connect() {
    try {
        await client.connect();
        db = client.db();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export const getDb = () => db;
// || 'mongodb://localhost:27017/vlog'