// API endpoints for appointments

const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");

router.post("/", appointmentsController.createAppointment);
router.get("/", appointmentsController.getAppointments);

module.exports = router;
