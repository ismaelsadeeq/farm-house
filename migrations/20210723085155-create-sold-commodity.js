'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('soldCommodities', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      userId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'users',
          key:'id',
          as:'userId'
        }
      },
      inventoryId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'inventories',
          key:'id',
          as:'inventoryId'
        }
      },
      deliveryAddressId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'deliveryAddresses',
          key:'id',
          as:'deliveryAddressId'
        }
      },
      productName: {
        type: Sequelize.STRING
      },
      numberOfProduct: {
        type: Sequelize.STRING
      },
      productUnit: {
        type: Sequelize.STRING
      },
      pricePerUnit: {
        type: Sequelize.STRING
      },
      cummulativeProductPrice: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      },
      isDelivered: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('soldCommodities');
  }
};