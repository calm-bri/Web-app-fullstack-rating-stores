const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rating = sequelize.define("Rating", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
      isInt: true
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Stores',
      key: 'id'
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {

  indexes: [
    {
      unique: true,
      fields: ['userId', 'storeId'],
      name: 'unique_user_store_rating'
    }
  ]
});

module.exports = Rating;