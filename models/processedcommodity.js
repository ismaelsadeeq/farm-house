'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class processedCommodity extends Model {
  };
  processedCommodity.associate = function(models){
    processedCommodity.belongsTo(models.miniProcessingCenter,{
      foreignKey:'processingCenterId'
    });
    processedCommodity.belongsTo(models.farmer,{
      foreignKey:'farmerId'
    });
  }
  processedCommodity.init({
    commodityName: DataTypes.STRING,
    commodityQuantity: DataTypes.STRING,
    commodityUnit: DataTypes.STRING,
    isProcessed: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'processedCommodity',
  });
  return processedCommodity;
};