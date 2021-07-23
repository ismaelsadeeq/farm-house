'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class soldCommodity extends Model {
  };
  soldCommodity.associate = function(models){
    soldCommodity.belongsTo(models.user,{
      foreignKey:'userId'
    });
    soldCommodity.belongsTo(models.inventory,{
      foreignKey:'inventoryId'
    });
    soldCommodity.belongsTo(models.deliveryAddress,{
      foreignKey:'deliveryAddressId'
    })
  }
  soldCommodity.init({
    productName: DataTypes.STRING,
    numberOfProduct: DataTypes.STRING,
    productUnit: DataTypes.STRING,
    pricePerUnit: DataTypes.STRING,
    cummulativeProductPrice: DataTypes.STRING,
    time: DataTypes.STRING,
    isDelivered: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'soldCommodity',
  });
  return soldCommodity;
};