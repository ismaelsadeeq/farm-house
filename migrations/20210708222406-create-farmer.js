'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('farmers', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: Sequelize.UUID
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        allowNull: false,
        unique:true,
        type: Sequelize.STRING
      },
      photoId: {
        type: Sequelize.STRING
      },
      biometric: {
        unique:true,
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      bvnNumber: {
        unique:true,
        type: Sequelize.STRING
      },
      accountName: {
        type: Sequelize.STRING
      },
      accountNumber: {
        unique:true,
        type: Sequelize.STRING
      },
      bank: {
        type: Sequelize.STRING
      },
      secretQuestion: {
        type: Sequelize.STRING
      },
      secretAnswer: {
        type: Sequelize.STRING
      },
      signature: {
        type: Sequelize.STRING
      },
      hasPin : {
        type: Sequelize.BOOLEAN
      },
      pin: {
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
    await queryInterface.dropTable('farmers');
  }
};