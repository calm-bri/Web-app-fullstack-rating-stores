//all model relationships

const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// User to Store 
User.hasMany(Store, { 
  foreignKey: 'ownerId', 
  as: 'ownedStores',
  onDelete: 'CASCADE' 
});
Store.belongsTo(User, { 
  foreignKey: 'ownerId', 
  as: 'owner' 
});

// User to Rating 
User.hasMany(Rating, { 
  foreignKey: 'userId', 
  as: 'ratings',
  onDelete: 'CASCADE' 
});
Rating.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

// Store to Rating 
Store.hasMany(Rating, { 
  foreignKey: 'storeId', 
  as: 'ratings',
  onDelete: 'CASCADE' 
});
Rating.belongsTo(Store, { 
  foreignKey: 'storeId', 
  as: 'store' 
});

// Export 
module.exports = {
  User,
  Store,
  Rating
};

//automatically update store average rating
Rating.addHook('afterCreate', async (rating) => {
  await updateStoreAverageRating(rating.storeId);
});

Rating.addHook('afterUpdate', async (rating) => {
  await updateStoreAverageRating(rating.storeId);
});

Rating.addHook('afterDestroy', async (rating) => {
  await updateStoreAverageRating(rating.storeId);
});

//store average rating (helper function)
async function updateStoreAverageRating(storeId) {
  const { Op } = require('sequelize');
  const sequelize = require('../config/database');
  
  const result = await Rating.findAll({
    where: { storeId },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
      [sequelize.fn('COUNT', sequelize.col('rating')), 'totalRatings']
    ],
    raw: true
  });
  
  const avgRating = parseFloat(result[0].avgRating) || 0;
  const totalRatings = parseInt(result[0].totalRatings) || 0;
  
  await Store.update(
    { 
      averageRating: Math.round(avgRating * 10) / 10,
      totalRatings: totalRatings 
    },
    { where: { id: storeId } }
  );
}