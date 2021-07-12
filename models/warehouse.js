'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class warehouse extends Model {
  };
  warehouse.associate = function(models){
    warehouse.hasMany(models.storage,{
      foreignKey:'warehouseId'
    });
  }
  warehouse.init({
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    localGovernment: DataTypes.STRING,
    description: DataTypes.STRING,
    address:DataTypes.STRING,
    category: DataTypes.STRING,
    storageCapacity: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'warehouse',
  });
  return warehouse;
};