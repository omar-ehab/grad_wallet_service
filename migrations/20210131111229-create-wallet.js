'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      available_balance: {
        type: Sequelize.FLOAT.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      },
      blocked_balance: {
        type: Sequelize.FLOAT.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      },
      reward_point: {
        type: Sequelize.FLOAT.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      }
    }, {
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: ["student_id"]
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Wallets');
  }
};