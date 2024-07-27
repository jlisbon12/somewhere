// API endpoints for users

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:userId", userController.getUserById);
router.post("/addUser", userController.addUser);
router.put("/updateUser", userController.updateUser);
router.get("/profilePicture/:userId", userController.getProfilePictureUrl);

module.exports = router;
