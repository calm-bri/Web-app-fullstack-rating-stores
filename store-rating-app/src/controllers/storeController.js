const { Store, User, Rating } = require("../models/index");
const { Op } = require("sequelize");

// ==============================
// Utility: format store response
// ==============================
const formatStore = (store, userId) => ({
  id: store.id,
  name: store.name,
  email: store.email,
  address: store.address,
  averageRating: store.averageRating || 0,
  totalRatings: store.totalRatings || 0,
  userRating:
    userId && store.ratings?.length > 0
      ? store.ratings[0].rating
      : null,
  userComment:
    userId && store.ratings?.length > 0
      ? store.ratings[0].comment
      : null,
  owner: store.owner || null,
  ratings: store.ratings
    ? store.ratings.map((rating) => ({
        id: rating.id,
        rating: rating.rating,
        comment: rating.comment,
        user: rating.user,
        createdAt: rating.createdAt,
      }))
    : [],
});

// ==============================
// Get all stores (user/admin/owner)
// ==============================
const getAllStores = async (req, res) => {
  try {
    const { search, name, address } = req.query;
    const userId = req.user.id;

    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      include: [
        { model: User, as: "owner", attributes: ["name", "email"] },
        {
          model: Rating,
          as: "ratings",
          where: { userId },
          required: false,
          attributes: ["rating", "comment"],
        },
      ],
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      count: stores.length,
      data: stores.map((s) => formatStore(s, userId)),
    });
  } catch (error) {
    console.error("Get all stores error:", error);
    res.status(500).json({ success: false, message: "Error fetching stores" });
  }
};

// ==============================
// Get stores for admin
// ==============================
const getStoresForAdmin = async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", sortOrder = "ASC" } =
      req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email", "address"] },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    res.json({ success: true, count: stores.length, data: stores });
  } catch (error) {
    console.error("Get stores for admin error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching stores for admin" });
  }
};

// ==============================
// Get stores owned by current user
// ==============================
const getMyStores = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const stores = await Store.findAll({
      where: { ownerId },
      include: [
        {
          model: Rating,
          as: "ratings",
          include: [{ model: User, as: "user", attributes: ["name", "email"] }],
        },
      ],
    });

    res.json({
      success: true,
      count: stores.length,
      data: stores.map((s) => formatStore(s)),
    });
  } catch (error) {
    console.error("Get my stores error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching your stores" });
  }
};

// ==============================
// Create store (admin or owner)
// ==============================
const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const { role, id: userId } = req.user;

    if (!name || !email || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email, and address are required" });
    }

    let finalOwnerId;
    if (role === "admin") {
      if (!ownerId) {
        return res
          .status(400)
          .json({ success: false, message: "Owner ID is required for admin" });
      }
      finalOwnerId = ownerId;
    } else if (role === "owner") {
      finalOwnerId = userId;
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Only admins and owners can create stores" });
    }

    const owner = await User.findOne({
      where: { id: finalOwnerId, role: "owner" },
    });
    if (!owner) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid owner ID or user is not owner" });
    }

    const existing = await Store.findOne({ where: { email } });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Store with this email already exists" });
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: finalOwnerId,
    });

    const storeWithOwner = await Store.findByPk(store.id, {
      include: [{ model: User, as: "owner", attributes: ["id", "name", "email"] }],
    });

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: storeWithOwner,
    });
  } catch (error) {
    console.error("Create store error:", error);
    res.status(500).json({ success: false, message: "Error creating store" });
  }
};

// ==============================
// Get single store by ID
// ==============================
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid store ID" });
    }

    const userId = req.user.id;
    const store = await Store.findByPk(id, {
      include: [
        { model: User, as: "owner", attributes: ["name", "email"] },
        {
          model: Rating,
          as: "ratings",
          where: { userId },
          required: false,
          attributes: ["rating", "comment"],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    res.json({ success: true, data: formatStore(store, userId) });
  } catch (error) {
    console.error("Get store by ID error:", error);
    res.status(500).json({ success: false, message: "Error fetching store" });
  }
};

// ==============================
// Update store (admin or owner)
// ==============================
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid store ID" });
    }

    const { name, email, address, ownerId } = req.body;
    const { role, id: userId } = req.user;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    if (role !== "admin" && store.ownerId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "You can only update your own stores" });
    }

    if (ownerId && ownerId !== store.ownerId) {
      if (role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Only admins can change ownership" });
      }

      const owner = await User.findOne({ where: { id: ownerId, role: "owner" } });
      if (!owner) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid owner ID or not a store owner" });
      }
    }

    await store.update({
      name: name || store.name,
      email: email || store.email,
      address: address || store.address,
      ownerId: ownerId || store.ownerId,
    });

    const updatedStore = await Store.findByPk(id, {
      include: [{ model: User, as: "owner", attributes: ["id", "name", "email"] }],
    });

    res.json({
      success: true,
      message: "Store updated successfully",
      data: updatedStore,
    });
  } catch (error) {
    console.error("Update store error:", error);
    res.status(500).json({ success: false, message: "Error updating store" });
  }
};

// ==============================
// Delete store (admin or owner)
// ==============================
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid store ID" });
    }

    const { role, id: userId } = req.user;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    if (role !== "admin" && store.ownerId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "You can only delete your own stores" });
    }

    await store.destroy();
    res.json({ success: true, message: "Store deleted successfully" });
  } catch (error) {
    console.error("Delete store error:", error);
    res.status(500).json({ success: false, message: "Error deleting store" });
  }
};

module.exports = {
  getAllStores,
  getStoresForAdmin,
  getMyStores,
  createStore,
  getStoreById,
  updateStore,
  deleteStore,
};
