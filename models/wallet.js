'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wallet extends Model {
  };
  wallet.associate = function(models){
    wallet.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  wallet.init({
    virtualWalletId: DataTypes.STRING,
    bank: DataTypes.STRING,
    customerCode: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    accountName: DataTypes.STRING,
    accountBalance: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'wallet',
  });
  return wallet;
};