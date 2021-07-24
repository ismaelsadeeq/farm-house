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
const getPurchasedCommodities = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const purchasedCommodities = await models.soldCommodity.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit
      }
    );
    if(!purchasedCommodities){
      responseData.status = false;
      responseData.message = "no purchased commodities at the moment";
      responseData.data = null;
      return res.json(responseData)
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = purchasedCommodities;
    return res.json(responseData);
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getPurchasedCommodity = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const purchasedCommodity = await models.soldCommodity.findOne(
      {
        where:{
          id:id
        }
      }
    );
    if(!purchasedCommodity){
      responseData.status = false;
      responseData.message = "no purchased commodities at the moment";
      responseData.data = null;
      return res.json(responseData)
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = purchasedCommodity;
    return res.json(responseData);
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const delivered = async (req,res)=>{
  const user = req.user;
  const id = req.params.id
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const purchasedCommodity = await models.soldCommodity.update(
      {
        isDelivered:true
      },
      {
        where:{
          id:id
        }
      }
    );
    if(!purchasedCommodity){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = null;
      return res.json(responseData)
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = undefined;
    return res.json(responseData);
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const unDelivered = async (req,res)=>{
  const user = req.user;
  const id = req.params.id
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const purchasedCommodity = await models.soldCommodity.update(
      {
        isDelivered:false
      },
      {
        where:{
          id:id
        }
      }
    );
    if(!purchasedCommodity){
      responseData.status = false;
      responseData.message = "something went wrong";
      responseData.data = null;
      return res.json(responseData)
    }
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = undefined;
    return res.json(responseData);
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
module.exports = {
  searchForAnInventory,
  getAllInventories,
  getAnInventory,
  getPurchasedCommodities,
  getPurchasedCommodity,
  delivered,
  unDelivered
}