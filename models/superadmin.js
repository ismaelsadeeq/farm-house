'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class superAdmin extends Model {
  
  };
  superAdmin.associate = function(models){
    superAdmin.hasOne(models.isLoggedOut,{
      foreignKey:'superAdminId'
    });
    superAdmin.hasMany(models.otpCode,{
      foreignKey:'superAdminId'
    });
  }
  superAdmin.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'superAdmin',
  });
  return superAdmin;
};