'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
  };
  category.associate = function(models){
    category.hasMany(models.storage,{
      foreignKey:'categoryId'
    });
    category.hasMany(models.inventory,{
      foreignKey:'categoryId'
    });
    category.hasMany(models.processedCommodity,{
      foreignKey:'categoryId'
    });
  }
  category.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'category',
  });
  return category;
};