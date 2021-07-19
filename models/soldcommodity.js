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
  }
  soldCommodity.init({
    time: DataTypes.STRING,
    isDeliverd: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'soldCommodity',
  });
  return soldCommodity;
};