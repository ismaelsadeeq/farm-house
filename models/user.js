'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
  };
  user.associate = function(models){
    user.hasOne(models.isLoggedOut,{
      foreignKey:'userId'
    });
    user.hasMany(models.otpCode,{
      foreignKey:'userId'
    });
    user.hasOne(models.wallet,{
      foreignKey:'userId'
    });
    user.hasMany(models.transaction,{
      foreignKey:'userId'
    });
    user.hasMany(models.soldCommodity,{
      foreignKey:'userId'
    });
    user.hasMany(models.deliveryAddress,{
      foreignKey:'userId'
    });
  }
  user.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    isAccountVerified :DataTypes.BOOLEAN,
    bvnNumber: DataTypes.STRING,
    isBvnVerified: DataTypes.BOOLEAN,
    privateKey: DataTypes.STRING,
    publicKey: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'user',
  });
  return user;
};