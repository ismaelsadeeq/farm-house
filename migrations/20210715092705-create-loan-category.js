'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loanCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      loanName: {
        type: Sequelize.STRING
      },
      loanType: {
        type: Sequelize.STRING
      },
      loanBenefit: {
        type: Sequelize.STRING
      },
      repaymentPrice: {
        type: Sequelize.STRING
      },
      repaymentPeriod: {
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
    await queryInterface.dropTable('loanCategories');
  }
};