'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class farmer extends Model {
  };
  farmer.associate = function(models){
    farmer.hasOne(models.isLoggedOut,{
      foreignKey:'farmerId'
    });
    farmer.hasMany(models.otpCode,{
      foreignKey:'farmerId'
    });
    farmer.hasMany(models.productStorage,{
      foreignKey:'farmerId'
    });
    farmer.hasMany(models.productWidthrawal,{
      foreignKey:'farmerId'
    });
    farmer.hasMany(models.processedCommodity,{
      foreignKey:'farmerId'
    });
  }
  farmer.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    photoId: DataTypes.STRING,
    Biometric: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    bvnNumber: DataTypes.STRING,
    bank:DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    hasPin : DataTypes.BOOLEAN,
    pin: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'farmer',
  });
  return farmer;
};