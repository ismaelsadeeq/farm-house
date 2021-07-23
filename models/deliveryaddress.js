'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class deliveryAddress extends Model {
  };
  deliveryAddress.associate = function(models){
    deliveryAddress.belongsTo(models.user,{
      foreignKey:'userId'
    })
    deliveryAddress.hasMany(models.soldCommodity,{
      foreignKey:'deliveryAddressId'
    });
  }
  deliveryAddress.init({
    state: DataTypes.STRING,
    lga: DataTypes.STRING,
    address: DataTypes.STRING,
    postalCode: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'deliveryAddress',
  });
  return deliveryAddress;
};