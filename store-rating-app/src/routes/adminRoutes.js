const express = require("express");
const {authMiddleware , isAdmin} = require("../middlewares/authMiddleware");
const {
  getAdminDashboardStats,
  getAllUsers,
  getAllStores,
  deleteUser,
  deleteStoreAdmin
} = require("../controllers/adminController");
const router = express.Router();

// Admin dashboard stats
router.get("/dashboard/admin/stats", authMiddleware, isAdmin, getAdminDashboardStats);

// Admin user management
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.delete("/users/:id", authMiddleware, isAdmin, deleteUser);

// Admin store management
router.get("/stores", authMiddleware, isAdmin, getAllStores);
router.delete("/stores/:id", authMiddleware, isAdmin, deleteStoreAdmin);

module.exports = router;
