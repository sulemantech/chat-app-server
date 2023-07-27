// User model using Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Add other user fields here (e.g., password, email, etc.).
});

module.exports = User;
