const express = require("express");
const {authMiddleware} = require("../middlewares/authMiddleware");
const {
  getAdminDashboardStats,
  getOwnerDashboardStats,
  getUserDashboardStats
} = require("../controllers/dashboardController");

const router = express.Router();

// Role checker middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }
    next();
  };
};

// Admin dashboard stats
router.get("/admin/stats", [authMiddleware, checkRole(['admin'])], getAdminDashboardStats);

// Owner dashboard stats
router.get("/owner/stats", [authMiddleware, checkRole(['owner'])], getOwnerDashboardStats);

// User dashboard stats
router.get("/user/stats", [authMiddleware, checkRole(['user'])], getUserDashboardStats);

module.exports = router;
