const { User, Store, Rating } = require("../models");
const sequelize = require("../config/database");

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "address", "createdAt"],
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message
    });
  }
};

// Get all stores (admin only)
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (err) {
    console.error("Get all stores error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching stores",
      error: err.message
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message
    });
  }
};

// Delete store (admin only)
exports.deleteStoreAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    await store.destroy();

    res.json({
      success: true,
      message: "Store deleted successfully"
    });
  } catch (err) {
    console.error("Delete store error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting store",
      error: err.message
    });
  }
};

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    const ratingStats = await Rating.findAll({
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
      raw: true
    });
    const averageRating = parseFloat(ratingStats[0].avgRating || 0).toFixed(1);

    const recentStores = await Store.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["name", "email"],
          required: false
        }
      ]
    });

    const recentRatings = await Rating.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, as: "user", attributes: ["name", "email"], required: false },
        { model: Store, as: "store", attributes: ["name"], required: false }
      ]
    });

    const bestStoreData = await Store.findOne({
      order: [["averageRating", "DESC"]],
      include: [{ model: User, as: "owner", attributes: ["name", "email"], required: false }]
    });

    const bestStore = bestStoreData
      ? {
          id: bestStoreData.id,
          name: bestStoreData.name,
          owner: bestStoreData.owner || null,
          averageRating: bestStoreData.averageRating
        }
      : null;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings,
        averageRating,
        recentStores,
        recentRatings,
        bestStore
      }
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: err.message
    });
  }
};
