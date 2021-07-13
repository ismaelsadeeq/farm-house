'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class isLoggedOut extends Model {
  };
  isLoggedOut.associate = function(models){
    isLoggedOut.belongsTo(models.admin,{
      foreignKey:'adminId'
    });
    isLoggedOut.belongsTo(models.farmer,{
      foreignKey:'farmerId'
    });
    isLoggedOut.belongsTo(models.superAdmin,{
      foreignKey:'superAdminId'
    });
  }
  isLoggedOut.init({
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    paranoid:true,
    modelName: 'isLoggedOut',
  });
  return isLoggedOut;
};