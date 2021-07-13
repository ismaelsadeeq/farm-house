//imports
const models = require('../models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const helpers = require('../utilities/helpers');
const smsGlobal = require('../utilities/sms.api');
const { Op } = require("sequelize");

require('dotenv').config();

//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}

const getAllInventories =  async (req,res)=>{
  const currentPage = parseInt(req.query.currentPage);
  const pageLimit = parseInt(req.query.pageLimit);

  const skip = currentPage * pageLimit;
  const count = await models.inventory.count();
  const data = await models.inventory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
    }
  );
  if(data){
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = data;
    responseData.totalNumberOfProducts = count
    return res.json(responseData)
  }
  responseData.message = "Opps there are no commodities for sale at the moment";
  responseData.status = true;
  responseData.data = null;
}

const getAnInventory = async (req,res)=>{
  const id = req.params.id
  const data = await models.inventory.findAll(
    {
      where:{
        id:id
      }
    }
  );
  if(data){
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = data;
    return res.json(responseData)
  }
  responseData.message = "Opps there are no commodities for sale at the moment";
  responseData.status = true;
  responseData.data = null;
}

const searchForAnInventory = async (req,res)=>{
  const keyword = req.query.search;
  const currentPage = parseInt(req.query.currentPage);
  const pageLimit = parseInt(req.query.pageLimit);

  const skip = currentPage * pageLimit;
  const data = await models.inventory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      where:{productName:{[Op.like]: keyword}}
    }
  );
  if(data){
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = data;
    return res.json(responseData)
  }
  responseData.message = `Opps there are no ${keyword} commodity in the market`;
  responseData.status = true;
  responseData.data = null;
}

module.exports = {
  searchForAnInventory,
  getAllInventories,
  getAnInventory
}