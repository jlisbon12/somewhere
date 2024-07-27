// server.js
// Express server, applies middleware, and mounts the route handlers.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// firebase admin sdk
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const app = express();
const Config = require("../config/config.json");
const port = Config.port;

// Middleware for parsing JSON bodies
app.use(express.json());

const allowedOrigins = [
  "http://localhost:8081",
  "https://trailblazergo.com",
  "https://trailblazer-flame.vercel.app",
  "https://super-panda-a3005d.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Import routes
const appointmentsRoutes = require("./routes/appointments");
const usersRoutes = require("./routes/users");

// Use routes
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/users", usersRoutes);

app.get("/api", (req, res) => {
  console.log("/api endpoint hit");
  res.send('"Forty-two," said Deep Thought, with infinite majesty and calm.');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
