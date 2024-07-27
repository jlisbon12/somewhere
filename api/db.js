// api/db.js
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri =
  "mongodb+srv://trailblazer:Trailblazer2024!@trailblazer.z7qhd1z.mongodb.net/?retryWrites=true&w=majority&appName=trailblazer";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDb(collectionName) {
  try {
    await client.connect();
    return client.db("trailblazer").collection(collectionName);
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
}

module.exports = { connectToDb };
