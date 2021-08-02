'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory extends Model {
  };
  inventory.associates = function(models){
    inventory.belongsTo(models.farmer,{
      foreignKey:'farmerId'
    });
    inventory.belongsTo(models.productStorage,{
      foreignKey:'productStorageId'
    });
    inventory.hasMany(models.soldCommodity,{
      foreignKey:'inventoryId'
    });
    inventory.belongsTo(models.category,{
      foreignKey:'categoryId'
    });
  }
  inventory.init({
    productName: DataTypes.STRING,
    numberOfProduct: DataTypes.STRING,
    productUnit: DataTypes.STRING,
    pricePerUnit: DataTypes.STRING,
    wooCommerceProductId:DataTypes.STRING,
    cummulativeProductPrice: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'inventory',
  });
  return inventory;
};