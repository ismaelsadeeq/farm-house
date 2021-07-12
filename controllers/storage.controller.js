//imports
const models = require('../models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const helpers = require('../utilities/helpers')
require('dotenv').config();

//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}

const storeProduct = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const data = req.body;
    let dateStored = new Date();
    let dateStoredString = dateStored.toLocaleString();
    const store = await models.storage.create(
      {
        id:uuid.v4(),
        farmerId:data.farmerId,
        warehouseId:data.warehouseId,
        productName:data.productName,
        numberOfProduct:data.numberOfProduct,
        unit:data.unit,
        dateStored:dateStored,
        dateStoredString:dateStoredString
      }
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "storage created";
    responseData.status = true;
    responseData.data = store;
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getAStorage = async (req,res)=>{
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
    const store = await models.storage.findOne(
      {
        where:{
          id:id
        },
        include:[
          {model:models.warehouse},
          {model:models.farmer}
        ],
      }
      
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getFarmerStorage = async (req,res)=>{
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
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const store = await models.storage.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          farmerId:id
        },
        include:[
          {model:models.warehouse},
          // {model:models.farmer}
        ],
      }
      
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getWarehouseStorage = async (req,res)=>{
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
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const store = await models.storage.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          warehouseId:id
        },
        include:[
          {model:models.warehouse},
          {model:models.farmer}
        ],
      }
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getAllStorage = async (req,res)=>{
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
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const store = await models.storage.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        include:[
          {model:models.warehouse},
          {model:models.farmer}
        ],
      }
      
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const widthraw = async (req,res)=>{
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
    const data = req.body;
    const storageId = req.params.id;
    const storage = await models.storage.findOne(
      {
        where:{
          id:storageId
        }
      }
    );
    let numberOfProducts = data.numberOfProducts;
    let newProductNumber = parseInt(storage.numberOfProduct) - parseInt(numberOfProducts);
    await models.storage.update(
      {
        numberOfProduct:newProductNumber
      },
      {
        where:{
          id:storageId
        }
      }
    );
    let currentDate = new Date();
    let dateStored = storage.dateStored;
    let periodOfStorage = currentDate - dateStored
    const productWidthrawal = await models.productWidthrawal.create(
      {
        id:uuid.v4(),
        storageId:storage.id,
        farmerId:storage.farmerId,
        widthrawalReason:data.widthrawalReason,
        numberOfProductWidthrawed:numberOfProducts,
        periodOfStorage:periodOfStorage
      }
    );
    if(!productWidthrawal){
      responseData.message = "completed";
      responseData.status = true;
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = productWidthrawal;
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

module.exports = {
  storeProduct,
  getAStorage,
  getFarmerStorage,
  getWarehouseStorage,
  getAllStorage,
  widthraw 
}