const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

const { UniqueConstraintError } = require("sequelize");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, address = "", role = "user" } = req.body;

    // validations
    if (name.length < 20 || name.length > 60)
      return res.status(400).json({ message: "Name must be 20-60 chars" });

    if (password.length < 8 || password.length > 16)
      return res.status(400).json({ message: "Password must be 8-16 chars" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    // Generate JWT token for the new user
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};
