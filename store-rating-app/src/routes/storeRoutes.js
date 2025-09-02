const express = require("express");
const router = express.Router();
const {
  getAllStores,
  getStoresForAdmin,
  getMyStores,
  createStore,
  getStoreById,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Role checker
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Insufficient permissions.",
    });
  }
  next();
};

// ==============================
// Admin routes
// ==============================
router.get("/admin/all", authMiddleware, checkRole(["admin"]), getStoresForAdmin);
router.put("/admin/:id", authMiddleware, checkRole(["admin"]), updateStore);
router.delete("/admin/:id", authMiddleware, checkRole(["admin"]), deleteStore);

// ==============================
// Owner routes
// ==============================
router.get("/owner/my-stores", authMiddleware, checkRole(["owner"]), getMyStores);
router.post("/owner/create", authMiddleware, checkRole(["owner"]), createStore);
router.put("/owner/:id", authMiddleware, checkRole(["owner"]), updateStore);
router.delete("/owner/:id", authMiddleware, checkRole(["owner"]), deleteStore);

// ==============================
// Shared routes
// ==============================
router.get("/", authMiddleware, checkRole(["user", "admin", "owner"]), getAllStores);
router.post("/", authMiddleware, checkRole(["admin", "owner"]), createStore);

// ⚠️ KEEP LAST so “admin”/“owner” aren’t mistaken as IDs
router.get("/:id", authMiddleware, checkRole(["user", "admin", "owner"]), getStoreById);

module.exports = router;
