'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class farmerWallet extends Model {
  };
  farmerWallet.associate = function(models){
    farmerWallet.belongsTo(models.farmer,{
      foreignKey:'farmerid'
    });
  }
  farmerWallet.init({
    balance: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'farmerWallet',
  });
  return farmerWallet;
};