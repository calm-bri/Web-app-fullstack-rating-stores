// controllers/ratingController.js
const Rating  = require("../models/Rating");

// Create rating
const createRating = async (req, res) => {
  try {
    const { storeId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating) {
      return res.status(400).json({ success: false, message: "Store ID and rating are required" });
    }

    // Prevent duplicate rating from same user
    const existing = await Rating.findOne({ where: { storeId, userId } });
    if (existing) {
      return res.status(400).json({ success: false, message: "You already rated this store" });
    }

    const newRating = await Rating.create({
      storeId,
      userId,
      rating,
      comment
    });

    res.status(201).json({ success: true, message: "Rating added", data: newRating });
  } catch (error) {
    console.error("Create rating error:", error);
    res.status(500).json({ success: false, message: "Error creating rating", error: error.message });
  }
};

// Create rating by admin
const createRatingByAdmin = async (req, res) => {
  try {
    const { storeId, userId, rating, comment } = req.body;

    if (!storeId || !userId || !rating) {
      return res.status(400).json({ success: false, message: "Store ID, User ID and rating are required" });
    }

    // Check if user exists
    const user = await require('../models/index').User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Check if store exists
    const store = await require('../models/index').Store.findByPk(storeId);
    if (!store) {
      return res.status(400).json({ success: false, message: "Store not found" });
    }

    // Prevent duplicate rating from same user
    const existing = await Rating.findOne({ where: { storeId, userId } });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already rated this store" });
    }

    const newRating = await Rating.create({
      storeId,
      userId,
      rating,
      comment
    });

    res.status(201).json({ success: true, message: "Rating added by admin", data: newRating });
  } catch (error) {
    console.error("Create rating by admin error:", error);
    res.status(500).json({ success: false, message: "Error creating rating", error: error.message });
  }
};

// Update rating
const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const existing = await Rating.findOne({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Rating not found or not yours" });
    }

    await existing.update({ rating, comment });

    res.json({ success: true, message: "Rating updated", data: existing });
  } catch (error) {
    console.error("Update rating error:", error);
    res.status(500).json({ success: false, message: "Error updating rating", error: error.message });
  }
};

// Update rating by admin
const updateRatingByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const existing = await Rating.findOne({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Rating not found" });
    }

    await existing.update({ rating, comment });

    res.json({ success: true, message: "Rating updated by admin", data: existing });
  } catch (error) {
    console.error("Update rating by admin error:", error);
    res.status(500).json({ success: false, message: "Error updating rating", error: error.message });
  }
};

// Delete rating
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let existing;
    if (userRole === 'admin') {
      // Admin can delete any rating
      existing = await Rating.findOne({ where: { id } });
    } else {
      // Regular user can delete only their own rating
      existing = await Rating.findOne({ where: { id, userId } });
    }

    if (!existing) {
      return res.status(404).json({ success: false, message: "Rating not found or not yours" });
    }

    await existing.destroy();

    res.json({ success: true, message: "Rating deleted" });
  } catch (error) {
    console.error("Delete rating error:", error);
    res.status(500).json({ success: false, message: "Error deleting rating", error: error.message });
  }
};

// Get ratings for a store
const getRatingsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{ association: "user", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]]
    });

    res.json({ success: true, count: ratings.length, data: ratings });
  } catch (error) {
    console.error("Get ratings error:", error);
    res.status(500).json({ success: false, message: "Error fetching ratings", error: error.message });
  }
};

// Get all ratings for admin
const getAllRatingsForAdmin = async (req, res) => {
  try {
    const { storeId, userId, rating, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    let whereClause = {};

    if (storeId) {
      whereClause.storeId = storeId;
    }

    if (userId) {
      whereClause.userId = userId;
    }

    if (rating) {
      whereClause.rating = rating;
    }

    const ratings = await Rating.findAll({
      where: whereClause,
      include: [
        {
          model: require('../models/index').Store,
          as: 'store',
          attributes: ['id', 'name', 'address', 'email']
        },
        {
          model: require('../models/index').User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (error) {
    console.error('Get all ratings for admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all ratings',
      error: error.message
    });
  }
};

// Get ratings by user
const getRatingsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const ratings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: require('../models/index').Store,
          as: 'store',
          attributes: ['id', 'name', 'address', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Format response for frontend
    const formattedRatings = ratings.map(rating => ({
      id: rating.id,
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt,
      storeName: rating.store.name,
      storeId: rating.store.id,
      storeAddress: rating.store.address
    }));

    res.json({
      success: true,
      count: formattedRatings.length,
      data: formattedRatings
    });
  } catch (error) {
    console.error('Get ratings by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your ratings',
      error: error.message
    });
  }
};

module.exports = {
  createRating,
  createRatingByAdmin,
  updateRating,
  updateRatingByAdmin,
  deleteRating,
  getRatingsByStore,
  getAllRatingsForAdmin,
  getRatingsByUser
};
