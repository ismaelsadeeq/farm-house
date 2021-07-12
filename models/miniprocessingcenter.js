'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class miniProcessingCenter extends Model {
  };
  miniProcessingCenter.init({
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    localGovernment: DataTypes.STRING,
    description: DataTypes.STRING,
    address:DataTypes.STRING,
    category: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'miniProcessingCenter',
  });
  return miniProcessingCenter;
};