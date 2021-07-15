'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loanCategory extends Model {
  };
  loanCategory.associate = function(models){
    loanCategory.hasMany(models.loan,{
      foreignKey:'loanCategoryId'
    });
  }
  loanCategory.init({
    loanName: DataTypes.STRING,
    loanType: DataTypes.STRING,
    loanBenefit: DataTypes.STRING,
    repaymentPrice: DataTypes.STRING,
    repaymentPeriod: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'loanCategory',
  });
  return loanCategory;
};