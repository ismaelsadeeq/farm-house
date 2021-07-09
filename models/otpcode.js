'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class otpCode extends Model {
  };
  otpCode.associate = function(models){
    otpCode.belongsTo(models.admin,{
      foreignKey:'adminId'
    });
  }
  otpCode.init({
    code: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'otpCode',
  });
  return otpCode;
};