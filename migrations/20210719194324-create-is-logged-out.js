'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('isLoggedOuts', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      adminId: {
        type: Sequelize.UUID,
        allowNull:true,
        onDelete:'CASCADE',
        references:{
          model:'admins',
          key:'id',
          as:'adminId'
        }
      },
      farmerId: {
        type: Sequelize.UUID,
        allowNull:true,
        onDelete:'CASCADE',
        references:{
          model:'farmers',
          key:'id',
          as:'farmerId'
        }
      },
      superAdminId: {
        type: Sequelize.UUID,
        allowNull:true,
        onDelete:'CASCADE',
        references:{
          model:'superAdmins',
          key:'id',
          as:'superAdminId'
        }
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
      status: {
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
    await queryInterface.dropTable('isLoggedOuts');
  }
};