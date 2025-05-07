const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

async function createUser() {
  const uri = 'mongodb://localhost:27017/vlog';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection('users');

    const username = 'piyush';
    const plainTextPassword = 'piyush@1234'; // Replace with your desired password
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10); // 10 is the saltRounds

    const result = await usersCollection.insertOne({ username, password: hashedPassword });
    console.log('User created:', result);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await client.close();
  }
}
createUser();
// Run this script once to create an admin user
// createUser();