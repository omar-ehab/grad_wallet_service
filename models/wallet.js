'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {

    async deposit(balance, t) {
      this.available_balance = this.available_balance + balance;
      await this.save({transaction: t});
    }

    async withdraw(balance, t) {
      this.available_balance = this.available_balance - balance;
      await this.save({transaction: t});
    }

    checkBalance(amount) {
      return this.available_balance >= amount
    }

  }

  Wallet.init({
    card_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    available_balance: {
      type: DataTypes.FLOAT.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    blocked_balance: {
      type: DataTypes.FLOAT.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    reward_point: {
      type: DataTypes.FLOAT.UNSIGNED,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Wallet',
    timestamps: false,
  });
  return Wallet;
};