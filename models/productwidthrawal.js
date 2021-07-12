'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productWidthrawal extends Model {
  };
  productWidthrawal.associate = function(models){
    productWidthrawal.belongsTo(models.storage,{
      foreignKey:'storageId'
    });
  }
  productWidthrawal.init({
    periodOfStorage: DataTypes.STRING,
    widthrawalReason: DataTypes.STRING,
    numberOfProductWidthrawed: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'productWidthrawal',
  });
  return productWidthrawal;
};