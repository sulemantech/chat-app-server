// Message model using Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Message = sequelize.define('Message', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add other message fields here (e.g., sender, receiver, room, etc.).
});

module.exports = Message;
