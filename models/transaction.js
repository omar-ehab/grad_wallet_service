'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    
  };

  Transaction.init({
    id:{
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement:true,
      primaryKey:true,
      allowNull: false
    },
    wallet_id:{ 
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false,
    },
    initialized_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    accepted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    other_id:{ 
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    }

  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions'
  });
  return Transaction;
};