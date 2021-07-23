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

const createWarehouse = async (req,res)=>{
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
    const warehouse = await models.warehouse.create(
      {
        id:uuid.v4(),
        name:data.name,
        state:data.state,
        localGovernment:data.localGovernment,
        address:data.address,
        description:data.description,
        category:data.category,
        storageCapacity:data.storageCapacity
      }
    );
    if(!warehouse) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "warehouse created";
    responseData.status = true;
    responseData.data = warehouse;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const editWarehouse = async (req,res)=>{
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
    const warehouse = await models.warehouse.update(
      {
        name:data.name,
        state:data.state,
        localGovernment:data.localGovernment,
        address:data.address,
        description:data.description,
        category:data.category,
        storageCapacity:data.storageCapacity
      },
      {
        where:{
          id:id
        }
      }
    );
    responseData.message = "warehouse updated";
    responseData.status = true;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getWarehouses = async (req,res)=>{
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
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const count = await models.warehouse.count();
    const warehouse = await models.warehouse.findAll(
      {
        order:[['createdAt','DESC']],
        attributes:['id','name','state','localGovernment','address','description','category','storageCapacity'],
        offset:skip,
        limit:pageLimit
      }
      
    );
    if(!warehouse) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.count = count;
    responseData.data = warehouse;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getWarehouse = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
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
    const warehouse = await models.warehouse.findOne(
      {
        where:{
          id:id
        },
        attributes:['id','name','state','localGovernment','address','description','category','storageCapacity']
      }
      
    );
    if(!warehouse) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = warehouse;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const deleteWarehouse = async (req,res)=>{
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
    const warehouse = await models.warehouse.destroy(
      {
        where:{
          id:id
        }
      }
      
    );
    if(!warehouse) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "warehouse center deleted";
    responseData.status = true;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

module.exports = {
  createWarehouse,
  editWarehouse,
  getWarehouses,
  getWarehouse,
  deleteWarehouse
}