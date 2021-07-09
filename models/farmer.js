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
    accountNumber: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    pin: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'farmer',
  });
  return farmer;
};