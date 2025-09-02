const express = require("express");
const { signup, login } = require("../controllers/authController");
const { User } = require("../models");

const router = express.Router();
//authenticate users and admins
router.post("/signup", signup);
router.post("/login", login);

// Admin route to get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      order: [['name', 'ASC']]
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
});

module.exports = router;
