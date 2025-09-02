const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createRating,
  createRatingByAdmin,
  updateRating,
  updateRatingByAdmin,
  deleteRating,
  getRatingsByStore,
  getAllRatingsForAdmin,
  getRatingsByUser
} = require("../controllers/ratingController");

const router = express.Router();

// Role checker
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Insufficient permissions." });
  }
  next();
};

// User must be logged in
router.post("/", authMiddleware, createRating);
router.put("/:id", authMiddleware, updateRating);
router.delete("/:id", authMiddleware, deleteRating);

//get all ratings for a store (public)
router.get("/store/:storeId", getRatingsByStore);

//get user's own ratings(Authenticated)
router.get("/user", authMiddleware, getRatingsByUser);

// Admin routes
router.get("/admin/all", authMiddleware, checkRole(['admin']), getAllRatingsForAdmin);
router.post("/admin", authMiddleware, checkRole(['admin']), createRatingByAdmin);
router.put("/admin/:id", authMiddleware, checkRole(['admin']), updateRatingByAdmin);

module.exports = router;
