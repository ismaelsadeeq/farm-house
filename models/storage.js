'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class storage extends Model {
  };
  storage.associate = function(models){
    storage.belongsTo(models.farmer,{
      foreignKey:'farmerId'
    });
    storage.belongsTo(models.warehouse,{
      foreignKey:'warehouseId'
    });
    storage.hasMany(models.productWidthrawal,{
      foreignKey:'storageId'
    });
  }
  storage.init({
    productName: DataTypes.STRING,
    numberOfProduct: DataTypes.STRING,
    unit: DataTypes.STRING,
    dateStoredString: DataTypes.STRING,
    dateStored :DataTypes.DATE
  }, {
    sequelize,
    paranoid:true,
    modelName: 'storage',
  });
  return storage;
};