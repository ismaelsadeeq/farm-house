'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
  };
  transaction.associate = function(models){
    transaction.belongsTo(models.user,{
      foreignKey:'userId'
    });
    transaction.belongsTo(models.farmer,{
      foreignKey:'farmerId'
    });
  }
  transaction.init({
    transactionType: DataTypes.STRING,
    amount: DataTypes.STRING,
    reference: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    time: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'transaction',
  });
  return transaction;
};