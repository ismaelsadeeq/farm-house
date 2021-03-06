'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('farmerWallets', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      farmerId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'farmers',
          key:'id',
          as:'farmerId'
        }
      }, 
      balance: {
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
    await queryInterface.dropTable('farmerWallets');
  }
};