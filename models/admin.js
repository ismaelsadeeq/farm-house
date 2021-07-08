'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
  };
  admin.associate = function(models){
    admin.hasOne(models.isLoggedOut,{
      foreignKey:'adminId'
    });
  }
  admin.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'admin',
  });
  return admin;
};