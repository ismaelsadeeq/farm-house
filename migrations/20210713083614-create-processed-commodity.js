'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('processedCommodities', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      processingCenterId: {
        type: Sequelize.UUID,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
          model:'miniProcessingCenters',
          key:'id',
          as:'processingCenterId'
        }
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
      commodityName: {
        type: Sequelize.STRING
      },
      commodityQuantity: {
        type: Sequelize.STRING
      },
      commodityUnit: {
        type: Sequelize.STRING
      },
      isProcessed: {
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
    await queryInterface.dropTable('processedCommodities');
  }
};