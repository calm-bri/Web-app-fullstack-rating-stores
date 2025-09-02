const { Store, User, Rating } = require('../models/index');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// admin dashboard statistics
const getAdminDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const [totalStores] = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Stores"'
    );
    const [totalUsers] = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Users" WHERE role = \'user\''
    );
    const [totalOwners] = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Users" WHERE role = \'owner\''
    );
    const [totalRatings] = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Ratings"'
    );

    // Get average rating across all stores 
    const [avgRatingResult] = await sequelize.query(
      'SELECT AVG("averageRating") as avg FROM "Stores" WHERE "averageRating" > 0'
    );

    // Get recent stores (last 5)
    const recentStores = await Store.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['name', 'email'],
          required: false
        }
      ],
      raw: false
    });

    // Get top-rated stores
    const topRatedStores = await Store.findAll({
      where: {
        averageRating: { [Op.gt]: 0 }
      },
      limit: 5,
      order: [['averageRating', 'DESC']],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['name'],
          required: false
        }
      ]
    });

    // Get recent ratings
    const recentRatings = await Rating.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['name']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        totalStores: parseInt(totalStores[0].count),
        totalUsers: parseInt(totalUsers[0].count),
        totalOwners: parseInt(totalOwners[0].count),
        totalRatings: parseInt(totalRatings[0].count),
        averageRating: parseFloat(avgRatingResult[0].avg || 0).toFixed(1),
        recentStores,
        topRatedStores,
        recentRatings
      }
    });
  } catch (error) {
    console.error('Get admin dashboard stats error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql,
      parameters: error.parameters
    });
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Get owner dashboard stats
const getOwnerDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get owners stores
    const ownerStores = await Store.findAll({
      where: { ownerId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email']
            }
          ]
        }
      ]
    });

    // calculate stats
    const totalStores = ownerStores.length;
    const totalRatings = ownerStores.reduce((sum, store) => sum + (store.ratings?.length || 0), 0);
    const averageRating = totalStores > 0
      ? ownerStores.reduce((sum, store) => sum + (store.averageRating || 0), 0) / totalStores
      : 0;

    // find best performing store
    const bestStore = ownerStores.reduce((best, current) =>
      (current.averageRating || 0) > (best?.averageRating || 0) ? current : best
    , null);

    // get recent ratings from all stores
    const allRatings = ownerStores.flatMap(store =>
      store.ratings?.map(rating => ({
        ...rating.toJSON(),
        storeName: store.name
      })) || []
    );

    const recentRatings = allRatings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalStores,
        totalRatings,
        averageRating: parseFloat(averageRating).toFixed(1),
        bestStore,
        recentRatings,
        stores: ownerStores
      }
    });
  } catch (error) {
    console.error('Get owner dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching owner dashboard statistics',
      error: error.message
    });
  }
};

// Get user dashboard stats
const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get users ratings
    const userRatings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address', 'averageRating', 'totalRatings']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate user stats
    const totalRatings = userRatings.length;

    // Find favorite store (highest rating given)
    const favoriteRating = userRatings.reduce((fav, current) =>
      current.rating > (fav?.rating || 0) ? current : fav
    , null);

    // Get all stores for recommendations
    const allStores = await Store.findAll({
      where: {
        averageRating: { [Op.gt]: 0 }
      },
      order: [['averageRating', 'DESC']],
      limit: 10
    });

    // Filter out stores user has already rated
    const ratedStoreIds = new Set(userRatings.map(r => r.storeId));
    const recommendedStores = allStores.filter(store => !ratedStoreIds.has(store.id)).slice(0, 5);

    // Get recent community ratings (from stores user hasn't rated)
    const unratedStores = allStores.filter(store => !ratedStoreIds.has(store.id)).slice(0, 3);
    const communityRatings = [];

    for (const store of unratedStores) {
      const recentRating = await Rating.findOne({
        where: { storeId: store.id },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name']
          }
        ]
      });

      if (recentRating) {
        communityRatings.push({
          ...recentRating.toJSON(),
          storeName: store.name
        });
      }
    }

    res.json({
      success: true,
      data: {
        totalRatings,
        favoriteStore: favoriteRating,
        recentActivity: userRatings.slice(0, 5),
        recommendedStores,
        communityRatings,
        topRatedStores: allStores.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Get user dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAdminDashboardStats,
  getOwnerDashboardStats,
  getUserDashboardStats
};