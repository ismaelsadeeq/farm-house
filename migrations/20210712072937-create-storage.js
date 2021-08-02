'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productStorages', {
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
      categoryId: {
        type: Sequelize.UUID,
        allowNull:true,
        onDelete:'CASCADE',
        references:{
          model:'categories',
          key:'id',
          as:'categoryId'
        }
      },
      warehouseId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'warehouses',
          key:'id',
          as:'warehouseId'
        }
      },
      storageAccountName: {
        type: Sequelize.STRING
      },
      storageAccountNumber: {
        type: Sequelize.STRING
      },
      productName: {
        type: Sequelize.STRING
      },
      numberOfProduct: {
        type: Sequelize.STRING
      },
      unit: {
        type: Sequelize.STRING
      },
      isForSale : {
        type : Sequelize.STRING
      },
      peggedPrice :{
        type : Sequelize.STRING,
      },
      dateStored : {
        type: Sequelize.DATE
      },
      dateStoredString :{
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
    await queryInterface.dropTable('productStorages');
  }
};