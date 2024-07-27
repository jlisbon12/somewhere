const db = require("../db"); // Use the db module to connect to your database

exports.createAppointment = async (req, res) => {
  const {
    counselorId,
    mentorId,
    menteeId,
    scheduledTime,
    duration,
    topicName,
    topicType,
    type,
  } = req.body;
  try {
    const collection = await db.connectToDb("appointments");
    const appointment = {
      counselorId,
      mentorId,
      menteeId,
      createdAt: new Date(),
      scheduledTime: new Date(scheduledTime),
      duration,
      status: "requested",
      topicName,
      topicType,
      type,
    };
    const result = await collection.insertOne(appointment);
    res.status(201).send(result.ops[0]);
  } catch (err) {
    console.error("Error creating appointment", err);
    res.status(500).send("Failed to create appointment");
  }
};

exports.getAppointments = async (req, res) => {
  const { userId, role } = req.query; // Fetch appointments based on user role
  try {
    const collection = await db.connectToDb("appointments");
    let query = {};
    if (role === "counselor") {
      query.counselorId = userId;
    } else if (role === "mentor") {
      query.mentorId = { $in: [userId] };
    } else if (role === "mentee") {
      query.menteeId = { $in: [userId] };
    }

    console.log("Query:", query); // Debug log
    const appointments = await collection.find(query).toArray();
    console.log("Appointments fetched:", appointments); // Debug log
    res.send(appointments);
  } catch (err) {
    console.error("Error fetching appointments", err);
    res.status(500).send("Failed to fetch appointments");
  }
};
