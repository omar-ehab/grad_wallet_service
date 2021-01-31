'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {

  }

  Wallet.init({
    student_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    available_balance: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    blocked_balance: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Wallet',
    timestamps: false,
  });
  return Wallet;
};