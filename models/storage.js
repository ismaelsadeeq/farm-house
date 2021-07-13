'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productStorage extends Model {
  };
  productStorage.associate = function(models){
    productStorage.belongsTo(models.farmer,{
      foreignKey:'farmerId'
    });
    productStorage.belongsTo(models.warehouse,{
      foreignKey:'warehouseId'
    });
    productStorage.hasMany(models.productWidthrawal,{
      foreignKey:'productStorageId'
    });
  }
  productStorage.init({
    productName: DataTypes.STRING,
    numberOfProduct: DataTypes.STRING,
    unit: DataTypes.STRING,
    isForSale:DataTypes.BOOLEAN,
    dateStoredString: DataTypes.STRING,
    dateStored :DataTypes.DATE
  }, {
    sequelize,
    paranoid:true,
    modelName: 'productStorage',
  });
  return productStorage;
};