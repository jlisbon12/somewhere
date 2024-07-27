const db = require("../db"); // Use the db module to connect to your database
const admin = require("firebase-admin");

// Fetch user details by ID
exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const collection = await db.connectToDb("users");
    const user = await collection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    console.error("Error fetching user details", err);
    res.status(500).send("Failed to fetch user details");
  }
};

// Middleware to verify Firebase ID token
exports.authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(403).send("Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).send("Unauthorized");
  }
};

// Controller to add a user
exports.addUser = async (req, res) => {
  console.log("addUser endpoint hit");
  const { uid, email, profile } = req.body;
  console.log("Request body:", req.body);

  try {
    const userCollection = await db.connectToDb("users");
    console.log("Connected to the database");
    const result = await userCollection.insertOne({
      _id: uid,
      role: "",
      profile: { ...profile, email },
      createdAt: new Date(),
    });
    console.log(`New user created with the following id: ${result.insertedId}`);
    res.status(201).send("User added successfully.");
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send("Error adding user.");
  }
};

// Controller to update a user's info
exports.updateUser = async (req, res) => {
  const { uid, ...updateFields } = req.body;
  try {
    const userCollection = await db.connectToDb("users");
    console.log(updateFields);
    const result = await userCollection.updateOne(
      { _id: uid },
      { $set: updateFields }
    );
    if (result.matchedCount === 0) {
      return res.status(404).send("User not found");
    }
    console.log(`User updated with the following id: ${uid}`);
    res.status(200).send("User updated successfully.");
  } catch (err) {
    res.status(500).send("Error updating user.");
  }
};

exports.getProfilePictureUrl = async (req, res) => {
  const { userId } = req.params;
  try {
    const collection = await db.connectToDb("users");
    const user = await collection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const pictureUrl = user.profile.profilePicture; // Make sure this is the correct field
    res.send({ pictureUrl });
  } catch (err) {
    console.error("Error fetching profile picture URL", err);
    res.status(500).send("Failed to fetch profile picture URL");
  }
};
