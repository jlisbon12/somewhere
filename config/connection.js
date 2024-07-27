// Archived placeholder codes for MongoDB connection - to be used for debugging CRUD

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Config = require("./config.json");
const uri = `mongodb+srv://${Config.username}:${Config.password}@${Config.clusterUrl}/?retryWrites=true&w=majority&appName=trailblazer`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function createUser(client, newUser) {
  const result = await client
    .db("trailblazer")
    .collection("users")
    .insertOne(newUser);
  console.log(
    `${result.insertedCount} new user(s) created with the following id(s):`
  );
  console.log(result.insertedIds);
}

async function createMultipleUsers(client, newUsers) {
  const result = await client
    .db("trailblazer")
    .collection("users")
    .insertMany(newUsers);
  console.log(
    `${result.insertedCount} new user(s) created with the following id(s):`
  );
  console.log(result.insertedIds);
}

async function createMultipleAppointments(client, newAppointments) {
  const result = await client
    .db("trailblazer")
    .collection("appointments")
    .insertMany(newAppointments);
  console.log(
    `${result.insertedCount} new appointment(s) created with the following id(s):`
  );
  console.log(result.insertedIds);
}

async function updateMentee(client, appointmentId, updatedMentee) {
  const result = await client
    .db("trailblazer")
    .collection("appointments")
    .updateOne({ _id: appointmentId }, { $set: updatedMentee });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    await listDatabases(client);
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
