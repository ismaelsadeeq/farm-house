'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wallets', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      userId: {
        type: Sequelize.UUID,
        allowNull:true,
        onDelete:'CASCADE',
        references:{
          model:'users',
          key:'id',
          as:'userId'
        }
      },
      virtualWalletId: {
        type: Sequelize.STRING
      },
      bank: {
        type: Sequelize.STRING
      },
      customerCode: {
        type: Sequelize.STRING
      },
      accountNumber: {
        type: Sequelize.STRING
      },
      accountName: {
        type: Sequelize.STRING
      },
      accountBalance: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('wallets');
  }
};