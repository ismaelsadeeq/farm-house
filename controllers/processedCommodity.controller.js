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

const createProcess = async (req,res)=>{
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
    const farmerId = req.params.farmerId;
    const centerId = req.params.id;
    const addCommodity = await models.processedCommodity.create(
      {
        id:uuid.v4(),
        farmerId:farmerId,
        commodityName:data.commodityName,
        processingCenterId:centerId,
        isProcessed:false
      }
    );
    if(addCommodity){
      responseData.message = "commodity added to processing center";
      responseData.status = true;
      responseData.data = addCommodity;
      return res.json(responseData);
    }
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData) 
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getCommodity = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isSuperAdmin = await models.superAdmin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isSuperAdmin){
    const id = req.params.id;
    const commodity = await models.processedCommodity.findOne(
      {
        where:{
          id:id
        },
        include:[
          {model:models.miniProcessingCenter},
          {model:models.farmer}
        ],
      }
    );
    if(commodity){
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = commodity;
      return res.json(responseData);
    }
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData) 
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}


const updateProcessStatus = async (req,res)=>{
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
    const id = req.params.id;
    const addCommodity = await models.processedCommodity.update(
      {
        commodityUnit:data.commodityUnit,
        commodityQuantity:data.commodityQuantity,
        isProcessed:true
      },
      {
        where:{
          id:id
        }
      }
    );
    if(!addCommodity){
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData) 
    }
    responseData.message = "commodity status updated to processed";
    responseData.status = true;
    responseData.data = null;
    return res.json(responseData);
    
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const deleteProduct = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const id = req.params.id;
    const commodity = await models.processedCommodity.delete(
     
      {
        where:{
          id:id
        }
      }
    );
    if(commodity){
      responseData.message = "commodity widthrawed from center";
      responseData.status = true;
      responseData.data = commodity;
      return res.json(responseData);
    }
    responseData.message = "something went wrong";
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData) 
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
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
    const id = req.params.id;
    const commodity = await models.processedCommodity.findOne(
      {
        where:{
          id:id
        }
      }
    );
    if(commodity){
      if(!commodity.isProcessed){
        responseData.message = `commodity with id ${id} is not processed`;
        responseData.status = false;
        responseData.data = null;
        return res.json(responseData) 
      }
      let warehouseId = req.params.warehouseId;
      let dateStored = new Date();
      let dateStoredString = dateStored.toLocaleString();
      const productStore = await models.productStorage.create(
        {
          id:uuid.v4(),
          farmerId:commodity.farmerId,
          warehouseId:warehouseId,
          productName:commodity.commodityName,
          numberOfProduct:commodity.commodityQuantity,
          unit:commodity.commodityUnit,
          dateStored:dateStored,
          dateStoredString:dateStoredString
        }
      );
      if(!productStore) {
        responseData.message = "something went wrong";
        responseData.status = false;
        responseData.data = null;
        return res.json(responseData)  
      }
        await models.processedCommodity.destroy(
          {
            where:{
              id:id
            }
          }
        )
        responseData.message = "storage created";
        responseData.status = true;
        responseData.data = productStore;
        return res.json(responseData)
    }
    responseData.message = `commodity with id ${id} does not exist`;
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData) 
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

module.exports = {
  createProcess,
  updateProcessStatus,
  deleteProduct,
  storeProduct,
  getCommodity
}

