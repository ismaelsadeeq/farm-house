'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loan extends Model {
  };
  loan.associate = function(models){
    loan.belongsTo(models.farmer,{
      foreignKey:'farmerId'
    });
    loan.belongsTo(models.farmerCategory,{
      foreignKey:'loanCategoryId'
    });
  }
  loan.init({
    reasonForApplication: DataTypes.STRING,
    isApproved: DataTypes.BOOLEAN,
    isGiven: DataTypes.BOOLEAN,
    isPaid: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'loan',
  });
  return loan;
};